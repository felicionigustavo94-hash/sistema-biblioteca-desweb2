<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReadingProgress extends Model
{
    use HasFactory;

    protected $table = 'reading_progress';

    protected $fillable = [
        'user_id',
        'digital_book_id',
        'chapter_index',
        'chapter_title',
        'percentage',
        'location',
    ];

    protected $casts = [
        'chapter_index' => 'integer',
        'percentage' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function digitalBook()
    {
        return $this->belongsTo(DigitalBook::class, 'digital_book_id');
    }
}
