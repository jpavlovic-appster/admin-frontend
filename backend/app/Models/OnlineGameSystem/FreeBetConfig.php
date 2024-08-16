<?php

namespace App\Models\OnlineGameSystem;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreeBetConfig extends Model
{
    use HasFactory;
    protected $table="online_game_system.free_bet_configs";
    protected $fillable = [
        "subscriber_id",
        "check_bet_time_before_claim_in_minutes",
        "check_bet_amount_before_claim"
    ];
}
