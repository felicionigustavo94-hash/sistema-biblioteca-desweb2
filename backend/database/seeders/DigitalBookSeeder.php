<?php

namespace Database\Seeders;

use App\Models\DigitalBook;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class DigitalBookSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Indexando acervo digital via Gutendex (Project Gutenberg)...');

        $totalIndexados = 0;
        
        // Buscar até 5 páginas do catálogo em português (32 livros por página = ~160 livros)
        for ($page = 1; $page <= 5; $page++) {
            $url = "https://gutendex.com/books/?languages=pt&page={$page}";
            try {
                $this->command->info("Obtendo página {$page} de livros em português...");
                $response = Http::withoutVerifying()
                    ->timeout(18)
                    ->withHeaders([
                        'User-Agent' => 'BiblioGest/1.1 (Academic Project)',
                        'Accept' => 'application/json',
                    ])
                    ->get($url);

                if ($response->successful()) {
                    $data = $response->json();
                    $results = $data['results'] ?? [];

                    foreach ($results as $item) {
                        $authorName = !empty($item['authors']) ? $item['authors'][0]['name'] : 'Autor Desconhecido';
                        if (str_contains($authorName, ',')) {
                            $parts = explode(',', $authorName, 2);
                            $authorName = trim($parts[1]) . ' ' . trim($parts[0]);
                        }

                        $formats = $item['formats'] ?? [];
                        $cover = $formats['image/jpeg'] ?? null;
                        $html = $formats['text/html'] ?? ($formats['text/html; charset=utf-8'] ?? null);
                        $epub = $formats['application/epub+zip'] ?? null;
                        $text = $formats['text/plain; charset=utf-8'] ?? ($formats['text/plain; charset=us-ascii'] ?? null);

                        $isReadable = !empty($html) || !empty($text);

                        DigitalBook::updateOrCreate(
                            ['external_id' => (string)$item['id']],
                            [
                                'source' => 'gutendex',
                                'title' => $item['title'] ?? 'Sem Título',
                                'author' => $authorName,
                                'authors_json' => json_encode($item['authors'] ?? []),
                                'language' => !empty($item['languages']) ? $item['languages'][0] : 'pt',
                                'subjects_json' => json_encode($item['subjects'] ?? []),
                                'cover_url' => $cover,
                                'epub_url' => $epub,
                                'html_url' => $html,
                                'text_url' => $text,
                                'download_count' => (int)($item['download_count'] ?? 0),
                                'is_readable' => $isReadable,
                                'copyright_status' => $item['copyright'] ? 'Com direitos' : 'Domínio Público',
                                'description' => !empty($item['subjects']) ? implode(' · ', array_slice($item['subjects'], 0, 3)) : 'Obra clássica do acervo do Project Gutenberg.',
                            ]
                        );

                        $totalIndexados++;
                    }
                } else {
                    $this->command->warn("Aviso na página {$page}: status " . $response->status());
                }
            } catch (\Throwable $e) {
                $this->command->warn("Timeout ou erro na página {$page}: " . $e->getMessage());
            }

            // Pausa educada de 300ms entre requisições para evitar rate limit do Gutenberg
            usleep(300000);
        }

        // Também indexar 2 páginas de clássicos internacionais em inglês (64 livros) para permitir filtro de idioma
        for ($page = 1; $page <= 2; $page++) {
            $url = "https://gutendex.com/books/?languages=en&page={$page}";
            try {
                $this->command->info("Obtendo página {$page} de clássicos universais (en)...");
                $response = Http::withoutVerifying()
                    ->timeout(18)
                    ->withHeaders(['User-Agent' => 'BiblioGest/1.1 (Academic Project)'])
                    ->get($url);

                if ($response->successful()) {
                    $data = $response->json();
                    $results = $data['results'] ?? [];

                    foreach ($results as $item) {
                        $authorName = !empty($item['authors']) ? $item['authors'][0]['name'] : 'Autor Desconhecido';
                        if (str_contains($authorName, ',')) {
                            $parts = explode(',', $authorName, 2);
                            $authorName = trim($parts[1]) . ' ' . trim($parts[0]);
                        }

                        $formats = $item['formats'] ?? [];
                        $cover = $formats['image/jpeg'] ?? null;
                        $html = $formats['text/html'] ?? ($formats['text/html; charset=utf-8'] ?? null);
                        $epub = $formats['application/epub+zip'] ?? null;
                        $text = $formats['text/plain; charset=utf-8'] ?? ($formats['text/plain; charset=us-ascii'] ?? null);

                        DigitalBook::updateOrCreate(
                            ['external_id' => (string)$item['id']],
                            [
                                'source' => 'gutendex',
                                'title' => $item['title'] ?? 'Sem Título',
                                'author' => $authorName,
                                'authors_json' => json_encode($item['authors'] ?? []),
                                'language' => !empty($item['languages']) ? $item['languages'][0] : 'en',
                                'subjects_json' => json_encode($item['subjects'] ?? []),
                                'cover_url' => $cover,
                                'epub_url' => $epub,
                                'html_url' => $html,
                                'text_url' => $text,
                                'download_count' => (int)($item['download_count'] ?? 0),
                                'is_readable' => !empty($html) || !empty($text),
                                'copyright_status' => $item['copyright'] ? 'Com direitos' : 'Domínio Público',
                                'description' => !empty($item['subjects']) ? implode(' · ', array_slice($item['subjects'], 0, 3)) : 'Obra clássica universal do acervo do Project Gutenberg.',
                            ]
                        );

                        $totalIndexados++;
                    }
                }
            } catch (\Throwable $e) {
                $this->command->warn("Aviso clássicos en página {$page}: " . $e->getMessage());
            }

            usleep(300000);
        }

        $totalGeral = DigitalBook::count();
        $this->command->info("Concluído! Total atual no banco local: {$totalGeral} obras digitais reais.");
    }
}
