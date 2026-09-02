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
    // 1. LOGIN / REGISTRO / LOGOUT
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

    // 2. LIVROS (LISTAR, CADASTRAR, EXCLUIR, BUSCAR ISBN)
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

    public function cadastrarLivro(Request $request)
    {
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

        return response()->json(['message' => 'Livro cadastrado!', 'book' => $book], 201);
    }

    public function excluirLivro($id)
    {
        Book::findOrFail($id)->delete();
        return response()->json(['message' => 'Livro excluído com sucesso!']);
    }

    // Busca dados por ISBN na API pública
    public function buscarIsbn(Request $request)
    {
        $isbn = preg_replace('/[^0-9X]/i', '', $request->isbn);

        if (!$isbn) {
            return response()->json(['message' => 'ISBN inválido'], 400);
        }

        try {
            $res = Http::timeout(5)->get("https://www.googleapis.com/books/v1/volumes?q=isbn:$isbn");
            if ($res->successful() && !empty($res->json('items'))) {
                $info = $res->json('items.0.volumeInfo');
                return response()->json([
                    'title' => $info['title'] ?? '',
                    'author' => isset($info['authors']) ? implode(', ', $info['authors']) : '',
                    'genre' => isset($info['categories']) ? implode(', ', $info['categories']) : '',
                    'synopsis' => $info['description'] ?? '',
                    'published_year' => isset($info['publishedDate']) ? substr($info['publishedDate'], 0, 4) : '',
                    'cover_path' => $info['imageLinks']['thumbnail'] ?? '',
                ]);
            }

            $resOpen = Http::timeout(5)->get("https://openlibrary.org/api/books?bibkeys=ISBN:$isbn&format=json&jscmd=data");
            $key = "ISBN:$isbn";
            if ($resOpen->successful() && isset($resOpen->json()[$key])) {
                $data = $resOpen->json()[$key];
                return response()->json([
                    'title' => $data['title'] ?? '',
                    'author' => isset($data['authors']) ? $data['authors'][0]['name'] : '',
                    'genre' => isset($data['subjects']) ? $data['subjects'][0]['name'] : '',
                    'synopsis' => is_string($data['notes'] ?? null) ? $data['notes'] : '',
                    'published_year' => $data['publish_date'] ?? '',
                    'cover_path' => $data['cover']['large'] ?? ($data['cover']['medium'] ?? ''),
                ]);
            }
        } catch (\Throwable $e) {}

        return response()->json(['message' => 'Livro não encontrado na API pública'], 404);
    }

    // 3. EMPRÉSTIMOS E DEVOLUÇÕES
    public function listarEmprestimos()
    {
        $loans = Loan::with(['book', 'user'])->orderBy('id', 'desc')->get();
        return response()->json($loans);
    }

    public function fazerEmprestimo(Request $request)
    {
        $book = Book::findOrFail($request->book_id);

        if ($book->available_copies <= 0) {
            return response()->json(['message' => 'Nenhum exemplar disponível!'], 400);
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
}