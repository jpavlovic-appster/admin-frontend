<?php

namespace App\Models\OnlineGameSystem;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreeBetRain extends Model
{
    use HasFactory;
    protected $table="online_game_system.free_bet_rains";

    protected $fillable = [
        "subscriber_id",
        "currency_code",
        "bet_amount",
        "num_of_free_bets",
        "start_time",
        "end_time",
        "rain_start_time",
        "rain_end_time",
        "minimum_multiplier",
        "expiry_after_claim",
        "promotion_name",
        "check_bet_time_before_claim_in_minutes",
        "check_bet_amount_before_claim"
    ];

}
