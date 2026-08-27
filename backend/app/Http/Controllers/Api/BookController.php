<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Services\BookApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    protected BookApiService $bookApiService;

    public function __construct(BookApiService $bookApiService)
    {
        $this->bookApiService = $bookApiService;
    }

    /**
     * Display a listing of the books with filtering and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Book::with('category');

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%")
                  ->orWhere('genre', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->boolean('available_only')) {
            $query->where('available_copies', '>', 0);
        }

        $books = $query->orderBy('title')->paginate($request->query('per_page', 12));

        return response()->json($books);
    }

    /**
     * Store a newly created book (with optional file upload for cover).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'genre' => ['nullable', 'string', 'max:100'],
            'isbn' => ['nullable', 'string', 'max:50'],
            'synopsis' => ['nullable', 'string'],
            'total_copies' => ['required', 'integer', 'min:1'],
            'available_copies' => ['nullable', 'integer', 'min:0'],
            'published_year' => ['nullable', 'string', 'max:10'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'cover' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'], // Max 3MB
            'cover_path' => ['nullable', 'string'],
        ]);

        $coverPath = $validated['cover_path'] ?? null;

        // Handle uploaded cover file
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('covers', 'public');
        }

        $book = Book::create([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'author' => $validated['author'],
            'genre' => $validated['genre'] ?? null,
            'isbn' => $validated['isbn'] ?? null,
            'cover_path' => $coverPath,
            'synopsis' => $validated['synopsis'] ?? null,
            'total_copies' => $validated['total_copies'],
            'available_copies' => $validated['available_copies'] ?? $validated['total_copies'],
            'published_year' => $validated['published_year'] ?? null,
            'publisher' => $validated['publisher'] ?? null,
        ]);

        $book->load('category');

        return response()->json([
            'message' => 'Livro cadastrado com sucesso',
            'book' => $book,
        ], 201);
    }

    /**
     * Display the specified book.
     */
    public function show(Book $book): JsonResponse
    {
        $book->load(['category', 'loans.user']);

        return response()->json($book);
    }

    /**
     * Update the specified book.
     */
    public function update(Request $request, Book $book): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'genre' => ['nullable', 'string', 'max:100'],
            'isbn' => ['nullable', 'string', 'max:50'],
            'synopsis' => ['nullable', 'string'],
            'total_copies' => ['required', 'integer', 'min:1'],
            'available_copies' => ['nullable', 'integer', 'min:0'],
            'published_year' => ['nullable', 'string', 'max:10'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'cover' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'cover_path' => ['nullable', 'string'],
        ]);

        $coverPath = $book->cover_path;

        if ($request->hasFile('cover')) {
            // Delete old uploaded image if stored locally
            if ($coverPath && !str_starts_with($coverPath, 'http') && Storage::disk('public')->exists($coverPath)) {
                Storage::disk('public')->delete($coverPath);
            }
            $coverPath = $request->file('cover')->store('covers', 'public');
        } elseif ($request->filled('cover_path')) {
            $coverPath = $request->input('cover_path');
        }

        $book->update([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'author' => $validated['author'],
            'genre' => $validated['genre'] ?? null,
            'isbn' => $validated['isbn'] ?? null,
            'cover_path' => $coverPath,
            'synopsis' => $validated['synopsis'] ?? null,
            'total_copies' => $validated['total_copies'],
            'available_copies' => $validated['available_copies'] ?? $book->available_copies,
            'published_year' => $validated['published_year'] ?? null,
            'publisher' => $validated['publisher'] ?? null,
        ]);

        $book->load('category');

        return response()->json([
            'message' => 'Livro atualizado com sucesso',
            'book' => $book,
        ]);
    }

    /**
     * Remove the specified book.
     */
    public function destroy(Book $book): JsonResponse
    {
        if ($book->cover_path && !str_starts_with($book->cover_path, 'http') && Storage::disk('public')->exists($book->cover_path)) {
            Storage::disk('public')->delete($book->cover_path);
        }

        $book->delete();

        return response()->json([
            'message' => 'Livro removido com sucesso',
        ]);
    }

    /**
     * Query public book APIs (Google Books / Open Library) by ISBN.
     */
    public function lookupIsbn(Request $request): JsonResponse
    {
        $isbn = $request->query('isbn');

        if (!$isbn) {
            return response()->json(['message' => 'ISBN n?o informado'], 400);
        }

        $bookData = $this->bookApiService->searchByIsbn($isbn);

        if (!$bookData) {
            return response()->json(['message' => 'Nenhum livro encontrado para este ISBN nas APIs p?blicas'], 404);
        }

        return response()->json($bookData);
    }
}