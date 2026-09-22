<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Obras do Catálogo Digital (e-books)
        Schema::create('digital_books', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique()->index();
            $table->string('source')->default('gutendex');
            $table->string('title');
            $table->string('author')->default('Desconhecido');
            $table->text('authors_json')->nullable();
            $table->string('language', 10)->default('pt')->index();
            $table->text('subjects_json')->nullable();
            $table->string('cover_url', 1000)->nullable();
            $table->string('epub_url', 1000)->nullable();
            $table->string('html_url', 1000)->nullable();
            $table->string('text_url', 1000)->nullable();
            $table->integer('download_count')->default(0);
            $table->boolean('is_readable')->default(true);
            $table->string('copyright_status')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Progresso de Leitura Persistente por Leitor
        Schema::create('reading_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('digital_book_id')->constrained('digital_books')->cascadeOnDelete();
            $table->integer('chapter_index')->default(0);
            $table->string('chapter_title')->nullable();
            $table->integer('percentage')->default(0);
            $table->string('location')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'digital_book_id']);
        });

        // 3. Livros Favoritos do Leitor
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('digital_book_id')->constrained('digital_books')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'digital_book_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('reading_progress');
        Schema::dropIfExists('digital_books');
    }
};
