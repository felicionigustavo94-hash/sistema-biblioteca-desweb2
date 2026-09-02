<?php

use App\Http\Controllers\BibliotecaController;
use Illuminate\Support\Facades\Route;

// Autenticação (Login / Cadastro)
Route::post('/auth/login', [BibliotecaController::class, 'login']);
Route::post('/auth/register', [BibliotecaController::class, 'register']);

// Livros & Busca ISBN
Route::get('/books', [BibliotecaController::class, 'listarLivros']);
Route::post('/books', [BibliotecaController::class, 'cadastrarLivro']);
Route::delete('/books/{id}', [BibliotecaController::class, 'excluirLivro']);
Route::get('/books/lookup/isbn', [BibliotecaController::class, 'buscarIsbn']);

// Empréstimos
Route::get('/loans', [BibliotecaController::class, 'listarEmprestimos']);
Route::post('/loans', [BibliotecaController::class, 'fazerEmprestimo']);
Route::post('/loans/{id}/return', [BibliotecaController::class, 'devolverLivro']);

// Dados do Usuário Logado
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [BibliotecaController::class, 'me']);
    Route::post('/auth/logout', [BibliotecaController::class, 'logout']);
});