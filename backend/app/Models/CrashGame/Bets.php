<?php

namespace App\Models\CrashGame;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SubscriberSystem\User;
class Bets extends Model
{
    use HasFactory;

    protected $table="online_game_system.crash_game_bets";
    protected $fillable = [
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo('App\Models\SubscriberSystem\User','user_id','id');
    }
}
