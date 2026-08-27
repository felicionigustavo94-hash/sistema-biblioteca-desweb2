<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use App\Models\Loan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Criar Usuários
        $admin = User::firstOrCreate(
            ['email' => 'admin@biblioteca.com'],
            [
                'name' => 'Administrador da Biblioteca',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '(11) 98888-7777',
            ]
        );

        $reader1 = User::firstOrCreate(
            ['email' => 'leitor@biblioteca.com'],
            [
                'name' => 'João Leitor',
                'password' => Hash::make('password123'),
                'role' => 'leitor',
                'phone' => '(11) 97777-6666',
            ]
        );

        $reader2 = User::firstOrCreate(
            ['email' => 'maria.silva@exemplo.com'],
            [
                'name' => 'Maria Silva',
                'password' => Hash::make('password123'),
                'role' => 'leitor',
                'phone' => '(11) 96666-5555',
            ]
        );

        // 2. Criar Categorias
        $catTech = Category::firstOrCreate(['name' => 'Tecnologia & Computação'], ['description' => 'Livros de programação, arquitetura e engenharia de software']);
        $catSciFi = Category::firstOrCreate(['name' => 'Ficção Científica'], ['description' => 'Obras de ficção científica, distopias e fantasia']);
        $catClassic = Category::firstOrCreate(['name' => 'Literatura Clássica'], ['description' => 'Grandes clássicos da literatura brasileira e mundial']);
        $catDev = Category::firstOrCreate(['name' => 'Desenvolvimento Pessoal'], ['description' => 'Produtividade, hábitos e carreira']);

        // 3. Criar Livros
        $book1 = Book::firstOrCreate(
            ['isbn' => '9788576082675'],
            [
                'category_id' => $catTech->id,
                'title' => 'Código Limpo: Habilidades Práticas do Agile Software',
                'author' => 'Robert C. Martin',
                'genre' => 'Engenharia de Software',
                'synopsis' => 'Mesmo um código ruim pode funcionar. Mas se ele não for limpo, pode acabar com uma empresa de desenvolvimento.',
                'cover_path' => 'https://covers.openlibrary.org/b/isbn/9788576082675-L.jpg',
                'total_copies' => 5,
                'available_copies' => 4,
                'published_year' => '2009',
                'publisher' => 'Alta Books',
            ]
        );

        $book2 = Book::firstOrCreate(
            ['isbn' => '9788580571875'],
            [
                'category_id' => $catSciFi->id,
                'title' => 'O Guia do Mochileiro das Galáxias',
                'author' => 'Douglas Adams',
                'genre' => 'Ficção Científica',
                'synopsis' => 'As hilárias desventuras espaciais de Arthur Dent após a destruição do planeta Terra para a construção de uma via espacial.',
                'cover_path' => 'https://covers.openlibrary.org/b/isbn/9788580571875-L.jpg',
                'total_copies' => 3,
                'available_copies' => 2,
                'published_year' => '1979',
                'publisher' => 'Editora Arqueiro',
            ]
        );

        $book3 = Book::firstOrCreate(
            ['isbn' => '9788594318602'],
            [
                'category_id' => $catClassic->id,
                'title' => 'Dom Casmurro',
                'author' => 'Machado de Assis',
                'genre' => 'Romance / Realismo',
                'synopsis' => 'A célebre história de Bento Santiago (Bentinho) e sua paixão por Capitu, marcada por dúvidas e ciúmes.',
                'cover_path' => 'https://covers.openlibrary.org/b/isbn/9788594318602-L.jpg',
                'total_copies' => 4,
                'available_copies' => 3,
                'published_year' => '1899',
                'publisher' => 'Principis',
            ]
        );

        $book4 = Book::firstOrCreate(
            ['isbn' => '9788577807000'],
            [
                'category_id' => $catTech->id,
                'title' => 'O Programador Pragmático: De Aprendiz a Mestre',
                'author' => 'Andrew Hunt & David Thomas',
                'genre' => 'Tecnologia',
                'synopsis' => 'Um dos livros de programação mais influentes de todos os tempos, abordando práticas, ferramentas e mentalidade do desenvolvedor.',
                'cover_path' => 'https://covers.openlibrary.org/b/isbn/9788577807000-L.jpg',
                'total_copies' => 2,
                'available_copies' => 2,
                'published_year' => '2010',
                'publisher' => 'Bookman',
            ]
        );

        // 4. Criar Empréstimos Exemplo
        Loan::firstOrCreate(
            [
                'user_id' => $reader1->id,
                'book_id' => $book1->id,
                'loan_date' => Carbon::now()->subDays(5)->format('Y-m-d'),
            ],
            [
                'due_date' => Carbon::now()->addDays(9)->format('Y-m-d'),
                'return_date' => null,
                'status' => 'ativo',
                'notes' => 'Empréstimo regular de estudo',
            ]
        );

        Loan::firstOrCreate(
            [
                'user_id' => $reader2->id,
                'book_id' => $book2->id,
                'loan_date' => Carbon::now()->subDays(20)->format('Y-m-d'),
            ],
            [
                'due_date' => Carbon::now()->subDays(6)->format('Y-m-d'),
                'return_date' => null,
                'status' => 'atrasado',
                'notes' => 'Aviso de atraso enviado por e-mail',
            ]
        );

        Loan::firstOrCreate(
            [
                'user_id' => $reader1->id,
                'book_id' => $book3->id,
                'loan_date' => Carbon::now()->subDays(30)->format('Y-m-d'),
            ],
            [
                'due_date' => Carbon::now()->subDays(16)->format('Y-m-d'),
                'return_date' => Carbon::now()->subDays(17)->format('Y-m-d'),
                'status' => 'devolvido',
                'notes' => 'Devolvido em perfeito estado',
            ]
        );
    }
}

