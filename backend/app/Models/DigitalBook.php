<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DigitalBook extends Model
{
    use HasFactory;

    protected $table = 'digital_books';

    protected $fillable = [
        'external_id',
        'source',
        'title',
        'author',
        'authors_json',
        'language',
        'subjects_json',
        'cover_url',
        'epub_url',
        'html_url',
        'text_url',
        'download_count',
        'is_readable',
        'copyright_status',
        'description',
    ];

    protected $casts = [
        'is_readable' => 'boolean',
        'download_count' => 'integer',
    ];

    public function readingProgresses()
    {
        return $this->hasMany(ReadingProgress::class, 'digital_book_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'digital_book_id');
    }
}
