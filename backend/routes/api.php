<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Rotas Públicas
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/lookup/isbn', [BookController::class, 'lookupIsbn']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Rotas Protegidas (Autenticação via Token Sanctum / Sessão)
Route::middleware('auth:sanctum')->group(function () {
    // Autenticação
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Gestão de Livros
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::post('/books/{book}', [BookController::class, 'update']); // Suporte a multipart/form-data com arquivos
    Route::delete('/books/{book}', [BookController::class, 'destroy']);

    // Categorias
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Empréstimos
    Route::get('/loans', [LoanController::class, 'index']);
    Route::post('/loans', [LoanController::class, 'store']);
    Route::get('/loans/{loan}', [LoanController::class, 'show']);
    Route::post('/loans/{loan}/return', [LoanController::class, 'returnBook']);
    Route::post('/loans/{loan}/renew', [LoanController::class, 'renew']);
    Route::delete('/loans/{loan}', [LoanController::class, 'destroy']);

    // Usuários
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
});

