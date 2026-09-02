<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class BibliotecaController extends Controller
{
    // ==========================================
    // 1. AUTENTICAÇÃO (LOGIN / REGISTRO / LOGOUT)
    // ==========================================

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'E-mail ou senha incorretos!'], 401);
        }

        $token = $user->createToken('token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'leitor',
        ]);

        $token = $user->createToken('token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Desconectado com sucesso!']);
    }

    // ==========================================
    // 2. LIVROS (LISTAR, CADASTRAR, BUSCAR ISBN)
    // ==========================================

    public function listarLivros(Request $request)
    {
        $query = Book::query();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where('title', 'like', "%$s%")
                  ->orWhere('author', 'like', "%$s%")
                  ->orWhere('isbn', 'like', "%$s%");
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // Apenas Administradores podem cadastrar livros
    public function cadastrarLivro(Request $request)
    {
        $currentUser = $request->user();

        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => 'Acesso negado. Apenas administradores podem cadastrar novos livros.'], 403);
        }

        $request->validate([
            'title' => 'required',
            'author' => 'required',
        ]);

        $coverPath = $request->cover_path;

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('covers', 'public');
        }

        $book = Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'genre' => $request->genre,
            'isbn' => $request->isbn,
            'cover_path' => $coverPath,
            'synopsis' => $request->synopsis,
            'total_copies' => $request->total_copies ?? 1,
            'available_copies' => $request->total_copies ?? 1,
            'published_year' => $request->published_year,
        ]);

        return response()->json(['message' => 'Livro cadastrado com sucesso!', 'book' => $book], 201);
    }

    public function excluirLivro(Request $request, $id)
    {
        $currentUser = $request->user();

        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => 'Apenas administradores podem excluir livros.'], 403);
        }

        Book::findOrFail($id)->delete();
        return response()->json(['message' => 'Livro excluído com sucesso!']);
    }

    // Busca robusta de dados por ISBN nas APIs públicas (BrasilAPI, OpenLibrary, GoogleBooks)
    public function buscarIsbn(Request $request)
    {
        $isbn = preg_replace('/[^0-9X]/i', '', (string)$request->isbn);

        if (empty($isbn)) {
            return response()->json(['message' => 'ISBN inválido ou não informado.'], 400);
        }

        // 1. Tenta BrasilAPI (Excelente para ISBNs nacionais e internacionais com resposta rápida)
        try {
            $resBrasil = Http::withoutVerifying()->timeout(6)->get("https://brasilapi.com.br/api/isbn/v1/{$isbn}");
            if ($resBrasil->successful()) {
                $data = $resBrasil->json();
                $authors = !empty($data['authors']) ? implode(', ', $data['authors']) : '';
                $subjects = !empty($data['subjects']) ? implode(', ', $data['subjects']) : ($data['genre'] ?? '');

                return response()->json([
                    'title' => $data['title'] ?? '',
                    'author' => $authors,
                    'genre' => $subjects,
                    'synopsis' => $data['synopsis'] ?? '',
                    'published_year' => isset($data['year']) ? (string)$data['year'] : '',
                    'cover_path' => $data['cover_url'] ?? '',
                    'source' => 'BrasilAPI',
                ]);
            }
        } catch (\Throwable $e) {}

        // 2. Tenta Open Library API (Internacional)
        try {
            $key = "ISBN:{$isbn}";
            $resOpen = Http::withoutVerifying()->timeout(6)->get("https://openlibrary.org/api/books", [
                'bibkeys' => $key,
                'format' => 'json',
                'jscmd' => 'data',
            ]);

            if ($resOpen->successful() && isset($resOpen->json()[$key])) {
                $data = $resOpen->json()[$key];

                $authors = [];
                if (!empty($data['authors'])) {
                    foreach ($data['authors'] as $a) {
                        $authors[] = $a['name'];
                    }
                }

                $cover = null;
                if (!empty($data['cover']['large'])) {
                    $cover = $data['cover']['large'];
                } elseif (!empty($data['cover']['medium'])) {
                    $cover = $data['cover']['medium'];
                }

                return response()->json([
                    'title' => $data['title'] ?? '',
                    'author' => implode(', ', $authors),
                    'genre' => !empty($data['subjects']) ? $data['subjects'][0]['name'] : '',
                    'synopsis' => is_string($data['notes'] ?? null) ? $data['notes'] : '',
                    'published_year' => $data['publish_date'] ?? '',
                    'cover_path' => $cover ?? '',
                    'source' => 'Open Library',
                ]);
            }
        } catch (\Throwable $e) {}

        // 3. Tenta Google Books API
        try {
            $resGoogle = Http::withoutVerifying()->timeout(6)->get("https://www.googleapis.com/books/v1/volumes?q=isbn:{$isbn}");
            if ($resGoogle->successful() && !empty($resGoogle->json('items'))) {
                $info = $resGoogle->json('items.0.volumeInfo');
                return response()->json([
                    'title' => $info['title'] ?? '',
                    'author' => isset($info['authors']) ? implode(', ', $info['authors']) : '',
                    'genre' => isset($info['categories']) ? implode(', ', $info['categories']) : '',
                    'synopsis' => $info['description'] ?? '',
                    'published_year' => isset($info['publishedDate']) ? substr($info['publishedDate'], 0, 4) : '',
                    'cover_path' => $info['imageLinks']['thumbnail'] ?? ($info['imageLinks']['smallThumbnail'] ?? ''),
                    'source' => 'Google Books',
                ]);
            }
        } catch (\Throwable $e) {}

        return response()->json(['message' => 'Nenhum livro encontrado para este ISBN nas APIs públicas.'], 404);
    }

    // ==========================================
    // 3. EMPRÉSTIMOS E DEVOLUÇÕES
    // ==========================================

    public function listarEmprestimos()
    {
        $loans = Loan::with(['book', 'user'])->orderBy('id', 'desc')->get();
        return response()->json($loans);
    }

    public function fazerEmprestimo(Request $request)
    {
        $book = Book::findOrFail($request->book_id);

        if ($book->available_copies <= 0) {
            return response()->json(['message' => 'Nenhum exemplar disponível no momento!'], 400);
        }

        $user = $request->user();

        $loan = Loan::create([
            'user_id' => $user ? $user->id : 1,
            'book_id' => $book->id,
            'loan_date' => Carbon::today()->format('Y-m-d'),
            'due_date' => Carbon::today()->addDays(14)->format('Y-m-d'),
            'status' => 'ativo',
        ]);

        $book->decrement('available_copies');

        return response()->json(['message' => 'Empréstimo realizado com sucesso!', 'loan' => $loan], 201);
    }

    public function devolverLivro($id)
    {
        $loan = Loan::findOrFail($id);

        if ($loan->status === 'devolvido') {
            return response()->json(['message' => 'Este livro já foi devolvido!'], 400);
        }

        $loan->update([
            'return_date' => Carbon::today()->format('Y-m-d'),
            'status' => 'devolvido',
        ]);

        $loan->book->increment('available_copies');

        return response()->json(['message' => 'Livro devolvido com sucesso!']);
    }

    // ==========================================
    // 4. GERENCIAMENTO DE USUÁRIOS (ADMIN)
    // ==========================================

    public function listarUsuarios(Request $request)
    {
        $currentUser = $request->user();

        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    public function alternarRoleUsuario(Request $request, $id)
    {
        $currentUser = $request->user();

        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $targetUser = User::findOrFail($id);

        // Inverte o perfil (se for admin vira leitor, se for leitor vira admin)
        $novoRole = ($targetUser->role === 'admin') ? 'leitor' : 'admin';
        $targetUser->update(['role' => $novoRole]);

        return response()->json([
            'message' => "Perfil de {$targetUser->name} alterado para {$novoRole}!",
            'user' => $targetUser,
        ]);
    }
}