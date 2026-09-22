<?php

namespace App\Http\Controllers;

use App\Models\DigitalBook;
use App\Models\Favorite;
use App\Models\ReadingProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DigitalBookController extends Controller
{
    /**
     * Catálogo Digital: Listagem Paginada com Filtros e Busca
     */
    public function index(Request $request)
    {
        $query = DigitalBook::query();

        // 1. Busca por Título ou Autor
        if ($request->filled('search')) {
            $termo = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($termo) {
                $q->where('title', 'like', $termo)
                  ->orWhere('author', 'like', $termo);
            });
        }

        // 2. Filtro por Idioma (padrão 'todos' ou 'pt')
        if ($request->filled('language') && $request->language !== 'all') {
            $query->where('language', $request->language);
        }

        // 3. Filtro Apenas com Leitura Habilitada
        if ($request->boolean('readable_only')) {
            $query->where('is_readable', true);
        }

        // Ordenação: mais populares/baixados ou alfabético
        $sort = $request->get('sort', 'popular');
        if ($sort === 'title') {
            $query->orderBy('title', 'asc');
        } elseif ($sort === 'recent') {
            $query->orderBy('id', 'desc');
        } else {
            $query->orderBy('download_count', 'desc');
        }

        $perPage = min((int)$request->get('per_page', 24), 60);
        $books = $query->paginate($perPage);

        // Se usuário autenticado, anexar status de favorito e progresso
        $user = $request->user('sanctum');
        if ($user) {
            $favIds = Favorite::where('user_id', $user->id)
                ->whereIn('digital_book_id', $books->pluck('id'))
                ->pluck('digital_book_id')
                ->toArray();

            $progressMap = ReadingProgress::where('user_id', $user->id)
                ->whereIn('digital_book_id', $books->pluck('id'))
                ->get()
                ->keyBy('digital_book_id');

            $books->getCollection()->transform(function ($b) use ($favIds, $progressMap) {
                $b->is_favorite = in_array($b->id, $favIds);
                $b->progress = $progressMap->get($b->id);
                return $b;
            });
        }

        return response()->json($books);
    }

    /**
     * Detalhes de uma Obra Digital Específica
     */
    public function show(Request $request, $id)
    {
        $book = DigitalBook::findOrFail($id);

        $user = $request->user('sanctum');
        if ($user) {
            $book->is_favorite = Favorite::where('user_id', $user->id)
                ->where('digital_book_id', $book->id)
                ->exists();

            $book->progress = ReadingProgress::where('user_id', $user->id)
                ->where('digital_book_id', $book->id)
                ->first();
        }

        return response()->json($book);
    }

    /**
     * Estatísticas Reais do Acervo Digital
     */
    public function stats()
    {
        return response()->json([
            'total' => DigitalBook::count(),
            'portugues' => DigitalBook::where('language', 'pt')->count(),
            'ingles' => DigitalBook::where('language', 'en')->count(),
            'com_leitura' => DigitalBook::where('is_readable', true)->count(),
        ]);
    }

    /**
     * Entrega Segura e Sanitizada de Conteúdo do E-book
     */
    public function content($id)
    {
        $book = DigitalBook::findOrFail($id);

        // Cache local do livro processado por 7 dias
        $cacheKey = "ebook_chapters_{$book->id}";
        $chaptersData = Cache::remember($cacheKey, 60 * 24 * 7, function () use ($book) {
            return $this->fetchAndParseBookContent($book);
        });

        if (empty($chaptersData['chapters'])) {
            return response()->json([
                'message' => 'Conteúdo digital temporariamente indisponível para esta obra.',
                'book' => $book,
            ], 404);
        }

        return response()->json([
            'book_id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'total_chapters' => count($chaptersData['chapters']),
            'chapters' => $chaptersData['chapters'],
        ]);
    }

    /**
     * Obter ou Atualizar Progresso de Leitura
     */
    public function getProgress(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['progress' => null]);
        }

        $progress = ReadingProgress::where('user_id', $user->id)
            ->where('digital_book_id', $id)
            ->first();

        return response()->json(['progress' => $progress]);
    }

    public function saveProgress(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Autenticação necessária para salvar progresso.'], 401);
        }

        $request->validate([
            'digital_book_id' => 'required|exists:digital_books,id',
            'chapter_index' => 'required|integer|min:0',
            'chapter_title' => 'nullable|string|max:255',
            'percentage' => 'required|integer|between:0,100',
            'location' => 'nullable|string',
        ]);

        $progress = ReadingProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'digital_book_id' => $request->digital_book_id,
            ],
            [
                'chapter_index' => $request->chapter_index,
                'chapter_title' => $request->chapter_title,
                'percentage' => $request->percentage,
                'location' => $request->location,
            ]
        );

        return response()->json(['message' => 'Progresso atualizado com sucesso.', 'progress' => $progress]);
    }

    /**
     * Minhas Leituras do Leitor (com progresso)
     */
    public function myReadings(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([]);
        }

        $progressList = ReadingProgress::with('digitalBook')
            ->where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($progressList);
    }

    /**
     * Gestão de Favoritos
     */
    public function favorites(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([]);
        }

        $favorites = Favorite::with('digitalBook')
            ->where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($favorites);
    }

    public function toggleFavorite(Request $request, $id = null)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Autenticação necessária para favoritar.'], 401);
        }

        $bookId = $id ?? $request->input('digital_book_id');
        if (!$bookId) {
            return response()->json(['message' => 'Identificador da obra é obrigatório.'], 422);
        }

        $fav = Favorite::where('user_id', $user->id)->where('digital_book_id', $bookId)->first();

        if ($fav) {
            $fav->delete();
            return response()->json(['favorited' => false, 'is_favorite' => false, 'message' => 'Removido dos favoritos.']);
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'digital_book_id' => $bookId,
            ]);
            return response()->json(['favorited' => true, 'is_favorite' => true, 'message' => 'Adicionado aos favoritos!']);
        }
    }

    /**
     * Processamento Seguro e Sanitizado de Conteúdo de E-book
     */
    private function fetchAndParseBookContent(DigitalBook $book): array
    {
        $url = $book->html_url ?: $book->text_url;
        if (!$url) {
            return ['chapters' => []];
        }

        try {
            $res = Http::withoutVerifying()
                ->timeout(15)
                ->withHeaders(['User-Agent' => 'BiblioGest/1.1 (Academic Project)'])
                ->get($url);

            if (!$res->successful()) {
                return ['chapters' => []];
            }

            $raw = $res->body();

            // Se for HTML, processar e sanitizar
            if ($book->html_url) {
                return $this->parseHtmlChapters($raw, $book->title);
            }

            // Se for texto simples (.txt)
            return $this->parseTextChapters($raw, $book->title);
        } catch (\Throwable $e) {
            return ['chapters' => []];
        }
    }

    private function parseHtmlChapters(string $html, string $bookTitle): array
    {
        // 1. Remover scripts, iframes e links de rastreamento por segurança estrita
        $clean = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html);
        $clean = preg_replace('/<iframe\b[^>]*>(.*?)<\/iframe>/is', '', $clean);
        $clean = preg_replace('/<link\b[^>]*>/is', '', $clean);
        $clean = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $clean);

        // 2. Extrair apenas o conteúdo do <body> se existir
        if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $clean, $bodyMatch)) {
            $clean = $bodyMatch[1];
        }

        // 3. Segmentar por divisores de capítulos comuns do Project Gutenberg
        // Procurar por <h1...h4> ou tags de início de capítulo
        $chunks = preg_split('/(<h[1-4][^>]*>.*?<\/h[1-4]>)/is', $clean, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);

        $chapters = [];
        $currentTitle = 'Início';
        $currentBody = '';

        foreach ($chunks as $chunk) {
            if (preg_match('/<h[1-4][^>]*>(.*?)<\/h[1-4]>/is', $chunk, $hMatch)) {
                // Se já acumulamos conteúdo no capítulo anterior, salvá-lo
                if (strlen(trim(strip_tags($currentBody))) > 150) {
                    $chapters[] = [
                        'index' => count($chapters),
                        'title' => $this->sanitizeTitle($currentTitle),
                        'content' => $this->cleanHtmlContent($currentBody),
                    ];
                    $currentBody = '';
                }
                $currentTitle = strip_tags($hMatch[1]);
            } else {
                $currentBody .= $chunk;
            }
        }

        // Salvar último capítulo
        if (strlen(trim(strip_tags($currentBody))) > 50) {
            $chapters[] = [
                'index' => count($chapters),
                'title' => $this->sanitizeTitle($currentTitle),
                'content' => $this->cleanHtmlContent($currentBody),
            ];
        }

        // Se a segmentação por tags H gerou menos de 2 capítulos, segmentar por parágrafos
        if (count($chapters) < 2) {
            return $this->chunkByParagraphs($clean, $bookTitle);
        }

        return ['chapters' => $chapters];
    }

    private function parseTextChapters(string $text, string $bookTitle): array
    {
        // Dividir texto por seções marcadas ou blocos de tamanho confortável (~3000 palavras)
        $paragraphs = preg_split('/\n\s*\n/', $text);
        $chapters = [];
        $currentBody = [];
        $wordsCount = 0;
        $chapIndex = 1;

        foreach ($paragraphs as $p) {
            $p = trim($p);
            if (empty($p)) continue;

            // Verificar se é cabeçalho de capítulo
            if (preg_match('/^(CAP[IÍ]TULO|CHAPTER|PARTE|SE[CÇ][AÃ]O)\b/i', $p)) {
                if (!empty($currentBody)) {
                    $chapters[] = [
                        'index' => count($chapters),
                        'title' => "Capítulo " . $chapIndex++,
                        'content' => implode("\n\n", array_map(fn($item) => "<p>{$item}</p>", $currentBody)),
                    ];
                    $currentBody = [];
                    $wordsCount = 0;
                }
            }

            $currentBody[] = htmlspecialchars($p, ENT_QUOTES, 'UTF-8');
            $wordsCount += str_word_count($p);

            // A cada ~2000 palavras, criar capítulo se for livro contínuo
            if ($wordsCount >= 2000) {
                $chapters[] = [
                    'index' => count($chapters),
                    'title' => "Parte " . (count($chapters) + 1),
                    'content' => implode("\n\n", array_map(fn($item) => "<p>{$item}</p>", $currentBody)),
                ];
                $currentBody = [];
                $wordsCount = 0;
            }
        }

        if (!empty($currentBody)) {
            $chapters[] = [
                'index' => count($chapters),
                'title' => "Parte " . (count($chapters) + 1),
                'content' => implode("\n\n", array_map(fn($item) => "<p>{$item}</p>", $currentBody)),
            ];
        }

        return ['chapters' => $chapters];
    }

    private function chunkByParagraphs(string $content, string $bookTitle): array
    {
        $paragraphs = preg_split('/<\/p>/i', $content);
        $chapters = [];
        $chunk = [];

        foreach ($paragraphs as $p) {
            $cleanP = strip_tags($p);
            if (strlen(trim($cleanP)) < 5) continue;

            $chunk[] = "<p>" . trim($cleanP) . "</p>";

            if (count($chunk) >= 25) {
                $chapters[] = [
                    'index' => count($chapters),
                    'title' => "Seção " . (count($chapters) + 1),
                    'content' => implode("\n", $chunk),
                ];
                $chunk = [];
            }
        }

        if (!empty($chunk)) {
            $chapters[] = [
                'index' => count($chapters),
                'title' => "Seção " . (count($chapters) + 1),
                'content' => implode("\n", $chunk),
            ];
        }

        return ['chapters' => $chapters];
    }

    private function sanitizeTitle(string $title): string
    {
        $title = trim(preg_replace('/\s+/', ' ', strip_tags($title)));
        if (empty($title) || strlen($title) > 80) {
            return 'Capítulo';
        }
        return $title;
    }

    private function cleanHtmlContent(string $html): string
    {
        // Permitir apenas tags de formatação de texto e parágrafos
        $allowedTags = '<p><br><b><i><strong><em><blockquote><cite><span>';
        return strip_tags($html, $allowedTags);
    }
}
