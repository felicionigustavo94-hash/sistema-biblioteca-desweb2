<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LibraryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_login(): void
    {
        $registerResponse = $this->postJson('/api/auth/register', [
            'name' => 'Aluno Teste',
            'email' => 'aluno@teste.com',
            'password' => 'senha123',
            'phone' => '11999998888',
        ]);

        $registerResponse->assertStatus(201)
            ->assertJsonStructure(['user', 'token']);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'aluno@teste.com',
            'password' => 'senha123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_can_list_books(): void
    {
        Book::create([
            'title' => 'Livro Teste',
            'author' => 'Autor Teste',
            'genre' => 'Fic??o',
            'isbn' => '9780000000000',
            'total_copies' => 3,
            'available_copies' => 3,
        ]);

        $response = $this->getJson('/api/books');

        $response->assertStatus(200)
            ->assertJsonPath('total', 1)
            ->assertJsonFragment(['title' => 'Livro Teste']);
    }

    public function test_user_can_borrow_and_return_a_book(): void
    {
        $user = User::create([
            'name' => 'Leitor Regular',
            'email' => 'leitor.reg@teste.com',
            'password' => Hash::make('senha123'),
            'role' => 'leitor',
        ]);

        $book = Book::create([
            'title' => 'Livro de Emprestimo',
            'author' => 'Escritor A',
            'total_copies' => 2,
            'available_copies' => 2,
        ]);

        // 1. Criar empr?stimo
        $loanResponse = $this->actingAs($user, 'sanctum')->postJson('/api/loans', [
            'book_id' => $book->id,
        ]);

        $loanResponse->assertStatus(201);
        $loanId = $loanResponse->json('loan.id');

        // Verificar se diminuiu exemplar dispon?vel
        $this->assertEquals(1, $book->fresh()->available_copies);

        // 2. Devolver empr?stimo
        $returnResponse = $this->actingAs($user, 'sanctum')->postJson("/api/loans/{$loanId}/return");

        $returnResponse->assertStatus(200)
            ->assertJsonPath('loan.status', 'devolvido');

        // Verificar se restaurou exemplar dispon?vel
        $this->assertEquals(2, $book->fresh()->available_copies);
    }
}