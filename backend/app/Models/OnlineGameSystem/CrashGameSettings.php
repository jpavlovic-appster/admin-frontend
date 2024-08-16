<?php

namespace App\Models\OnlineGameSystem;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrashGameSettings extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table="online_game_system.crash_game_settings";

    protected $fillable = [
        "id",
        "min_bet",
        "max_bet",
        "max_profit",
        "created_at",
        "subscriber_id"
    ];
}
