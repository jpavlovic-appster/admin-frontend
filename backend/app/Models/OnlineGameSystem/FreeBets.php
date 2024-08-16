<?php

namespace App\Models\OnlineGameSystem;

use App\Models\SubscriberSystem\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreeBets extends Model
{
    use HasFactory;
    protected $table="online_game_system.free_bets";

    protected $fillable = [
        "user_id",
        "subscriber_id",
        "currency_code",
        "bet_amount",
        "num_of_free_bets",
        "end_date",

    ];

    public function user(){
      return $this->hasMany(User::class,"id","user_id");
  }

}
