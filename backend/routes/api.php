<?php

use App\Http\Controllers\BibliotecaController;
use Illuminate\Support\Facades\Route;

// Rotas Públicas
Route::post('/auth/login', [BibliotecaController::class, 'login']);
Route::post('/auth/register', [BibliotecaController::class, 'register']);
Route::get('/books', [BibliotecaController::class, 'listarLivros']);
Route::get('/books/lookup/isbn', [BibliotecaController::class, 'buscarIsbn']);
Route::get('/loans', [BibliotecaController::class, 'listarEmprestimos']);

// Rotas Autenticadas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [BibliotecaController::class, 'me']);
    Route::post('/auth/logout', [BibliotecaController::class, 'logout']);

    // Cadastro e Exclusão de Livros (Apenas Admin)
    Route::post('/books', [BibliotecaController::class, 'cadastrarLivro']);
    Route::delete('/books/{id}', [BibliotecaController::class, 'excluirLivro']);

    // Empréstimos
    Route::post('/loans', [BibliotecaController::class, 'fazerEmprestimo']);
    Route::post('/loans/{id}/return', [BibliotecaController::class, 'devolverLivro']);

    // Gerenciamento de Usuários (Apenas Admin)
    Route::get('/users', [BibliotecaController::class, 'listarUsuarios']);
    Route::put('/users/{id}/role', [BibliotecaController::class, 'alternarRoleUsuario']);
});