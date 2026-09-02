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

    public function test_fluxo_completo_com_admin(): void
    {
        // 1. Criar e logar Admin
        $admin = User::create([
            'name' => 'Admin Fatec',
            'email' => 'admin@fatec.sp.gov.br',
            'password' => Hash::make('senha123'),
            'role' => 'admin',
        ]);

        // 2. Admin cadastra livro
        $livroRes = $this->actingAs($admin, 'sanctum')->postJson('/api/books', [
            'title' => 'Clean Code',
            'author' => 'Robert Martin',
            'total_copies' => 2,
        ]);
        $livroRes->assertStatus(201);
        $bookId = $livroRes->json('book.id');

        // 3. Usuário leitor faz empréstimo
        $leitor = User::create([
            'name' => 'Aluno Leitor',
            'email' => 'aluno@fatec.sp.gov.br',
            'password' => Hash::make('senha123'),
            'role' => 'leitor',
        ]);

        $emp = $this->actingAs($leitor, 'sanctum')->postJson('/api/loans', [
            'book_id' => $bookId,
        ]);
        $emp->assertStatus(201);
        $loanId = $emp->json('loan.id');

        // 4. Devolver Livro
        $dev = $this->actingAs($leitor, 'sanctum')->postJson("/api/loans/{$loanId}/return");
        $dev->assertStatus(200);

        // 5. Admin altera role do usuário
        $roleRes = $this->actingAs($admin, 'sanctum')->putJson("/api/users/{$leitor->id}/role");
        $roleRes->assertStatus(200);
        $this->assertEquals('admin', $leitor->fresh()->role);
    }
}