<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Languages extends Model
{
    use HasFactory;

    protected $table="languages";

    protected $fillable = [
        'code',
        'name',
        'user_json',
        'user_backend_json',
        'created_at',
        'updated_at',
    ];

}
