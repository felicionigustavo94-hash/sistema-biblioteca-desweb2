<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'author',
        'genre',
        'isbn',
        'cover_path',
        'synopsis',
        'total_copies',
        'available_copies',
        'published_year',
        'publisher',
    ];

    protected $appends = [
        'cover_url',
    ];

    /**
     * Get the full URL for the book cover (works with local storage or external URLs).
     */
    protected function coverUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->cover_path) {
                    return null;
                }

                if (str_starts_with($this->cover_path, 'http://') || str_starts_with($this->cover_path, 'https://')) {
                    return $this->cover_path;
                }

                return url(Storage::url($this->cover_path));
            }
        );
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }
}

