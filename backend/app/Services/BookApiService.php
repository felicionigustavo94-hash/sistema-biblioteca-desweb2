<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BookApiService
{
    /**
     * Search book metadata by ISBN using Google Books API and Open Library API as fallback.
     *
     * @param string $isbn
     * @return array|null
     */
    public function searchByIsbn(string $isbn): ?array
    {
        $cleanIsbn = preg_replace('/[^0-9X]/i', '', $isbn);

        if (empty($cleanIsbn)) {
            return null;
        }

        // 1. Try Google Books API
        try {
            $response = Http::timeout(6)->get('https://www.googleapis.com/books/v1/volumes', [
                'q' => 'isbn:' . $cleanIsbn,
            ]);

            if ($response->successful() && !empty($response->json('items'))) {
                $item = $response->json('items.0.volumeInfo');

                return [
                    'isbn' => $cleanIsbn,
                    'title' => $item['title'] ?? null,
                    'author' => !empty($item['authors']) ? implode(', ', $item['authors']) : null,
                    'genre' => !empty($item['categories']) ? implode(', ', $item['categories']) : null,
                    'synopsis' => $item['description'] ?? null,
                    'published_year' => isset($item['publishedDate']) ? substr($item['publishedDate'], 0, 4) : null,
                    'publisher' => $item['publisher'] ?? null,
                    'cover_path' => $item['imageLinks']['thumbnail'] ?? ($item['imageLinks']['smallThumbnail'] ?? null),
                    'source' => 'Google Books API',
                ];
            }
        } catch (\Throwable $e) {
            Log::warning('Google Books API lookup failed: ' . $e->getMessage());
        }

        // 2. Fallback to Open Library API
        try {
            $bibKey = 'ISBN:' . $cleanIsbn;
            $response = Http::timeout(6)->get('https://openlibrary.org/api/books', [
                'bibkeys' => $bibKey,
                'format' => 'json',
                'jscmd' => 'data',
            ]);

            if ($response->successful() && isset($response->json()[$bibKey])) {
                $data = $response->json()[$bibKey];

                $authors = [];
                if (!empty($data['authors'])) {
                    foreach ($data['authors'] as $author) {
                        $authors[] = $author['name'];
                    }
                }

                $cover = null;
                if (!empty($data['cover']['large'])) {
                    $cover = $data['cover']['large'];
                } elseif (!empty($data['cover']['medium'])) {
                    $cover = $data['cover']['medium'];
                }

                return [
                    'isbn' => $cleanIsbn,
                    'title' => $data['title'] ?? null,
                    'author' => !empty($authors) ? implode(', ', $authors) : null,
                    'genre' => !empty($data['subjects']) ? $data['subjects'][0]['name'] : null,
                    'synopsis' => is_array($data['notes'] ?? null) ? ($data['notes']['value'] ?? null) : ($data['notes'] ?? null),
                    'published_year' => $data['publish_date'] ?? null,
                    'publisher' => !empty($data['publishers']) ? $data['publishers'][0]['name'] : null,
                    'cover_path' => $cover,
                    'source' => 'Open Library API',
                ];
            }
        } catch (\Throwable $e) {
            Log::warning('Open Library API lookup failed: ' . $e->getMessage());
        }

        return null;
    }
}