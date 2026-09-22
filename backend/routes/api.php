<?php

use App\Http\Controllers\BibliotecaController;
use App\Http\Controllers\DigitalBookController;
use Illuminate\Support\Facades\Route;

// Rotas Públicas
Route::post('/auth/login', [BibliotecaController::class, 'login']);
Route::post('/auth/register', [BibliotecaController::class, 'register']);
Route::get('/books', [BibliotecaController::class, 'listarLivros']);
Route::get('/books/lookup/isbn', [BibliotecaController::class, 'buscarIsbn']);
Route::get('/loans', [BibliotecaController::class, 'listarEmprestimos']);

// Catálogo Digital & Leitura (Público)
Route::get('/digital-books', [DigitalBookController::class, 'index']);
Route::get('/digital-books/stats', [DigitalBookController::class, 'stats']);
Route::get('/digital-books/{id}', [DigitalBookController::class, 'show'])->whereNumber('id');
Route::get('/digital-books/{id}/content', [DigitalBookController::class, 'content'])->whereNumber('id');

// Rotas Autenticadas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [BibliotecaController::class, 'me']);
    Route::post('/auth/logout', [BibliotecaController::class, 'logout']);

    // Cadastro e Exclusão de Livros Físicos (Apenas Admin)
    Route::post('/books', [BibliotecaController::class, 'cadastrarLivro']);
    Route::delete('/books/{id}', [BibliotecaController::class, 'excluirLivro']);

    // Empréstimos
    Route::post('/loans', [BibliotecaController::class, 'fazerEmprestimo']);
    Route::post('/loans/{id}/return', [BibliotecaController::class, 'devolverLivro']);

    // Gerenciamento de Usuários (Apenas Admin)
    Route::get('/users', [BibliotecaController::class, 'listarUsuarios']);
    Route::put('/users/{id}/role', [BibliotecaController::class, 'alternarRoleUsuario']);

    // Progresso de Leitura e Favoritos do Leitor
    Route::get('/reading-progress/{id}', [DigitalBookController::class, 'getProgress']);
    Route::post('/reading-progress', [DigitalBookController::class, 'saveProgress']);
    Route::get('/my-readings', [DigitalBookController::class, 'myReadings']);
    Route::get('/digital-books/my-readings', [DigitalBookController::class, 'myReadings']);
    Route::get('/favorites', [DigitalBookController::class, 'favorites']);
    Route::get('/digital-books/favorites', [DigitalBookController::class, 'favorites']);
    Route::post('/favorites/toggle', [DigitalBookController::class, 'toggleFavorite']);
    Route::post('/digital-books/{id}/favorite', [DigitalBookController::class, 'toggleFavorite'])->whereNumber('id');
});