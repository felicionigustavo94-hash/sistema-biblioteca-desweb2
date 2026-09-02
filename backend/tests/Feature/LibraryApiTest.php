<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LibraryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_fluxo_basico_da_biblioteca(): void
    {
        // 1. Testar Registro de Usuário
        $reg = $this->postJson('/api/auth/register', [
            'name' => 'Aluno Fatec',
            'email' => 'aluno@fatec.sp.gov.br',
            'password' => 'senha123',
        ]);
        $reg->assertStatus(201);

        // 2. Testar Login
        $login = $this->postJson('/api/auth/login', [
            'email' => 'aluno@fatec.sp.gov.br',
            'password' => 'senha123',
        ]);
        $login->assertStatus(200);

        // 3. Testar Cadastro de Livro
        $livroRes = $this->postJson('/api/books', [
            'title' => 'Clean Code',
            'author' => 'Robert Martin',
            'total_copies' => 2,
        ]);
        $livroRes->assertStatus(201);
        $bookId = $livroRes->json('book.id');

        // 4. Testar Empréstimo
        $user = User::first();
        $emp = $this->actingAs($user, 'sanctum')->postJson('/api/loans', [
            'book_id' => $bookId,
        ]);
        $emp->assertStatus(201);
        $loanId = $emp->json('loan.id');

        // 5. Testar Devolução
        $dev = $this->actingAs($user, 'sanctum')->postJson("/api/loans/{$loanId}/return");
        $dev->assertStatus(200);
    }
}