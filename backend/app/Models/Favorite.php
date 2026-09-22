<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $table = 'favorites';

    protected $fillable = [
        'user_id',
        'digital_book_id',
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
