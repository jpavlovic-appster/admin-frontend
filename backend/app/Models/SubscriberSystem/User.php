<?php

namespace App\Models\SubscriberSystem;

use App\Models\CrashGame\Bets;
use App\Models\OnlineGameSystem\FreeBets;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Redis;

class User extends Model
{
  use HasFactory;
  use SoftDeletes;
  protected $table = "subscriber_system.users";
  protected $appends = ['online_status','last_active'];

  protected $fillable = [
    'subscriber_id',
    'user_code',
    'currency_code'
  ];
  public $timestamps = false;
  public function freeBet()
    {
        return $this->hasMany(FreeBets::class);
    }
    public function subscriber()
    {
        return $this->belongsTo(Subscriber::class,'subscriber_id','id');
    }
    public function UserBets()
    {
        return $this->hasMany(Bets::class,'user_id','id');
    }


    public function getOnlineStatusAttribute(){
      $redis = Redis::connection();
        $token = Redis::get('PLAYER-TOKEN:OperatorId-' . $this->subscriber_id . '.UserId:' . $this->id);
        if ($token) {
            $token = json_decode($token);
            $token = $token->lastActiveAt;
            $dt = date("Y-m-d H:i:s", substr($token, 0, 10));
            $now = Carbon::now()->toDateTimeString();
            $datework = Carbon::parse($dt);
            $diff = $datework->diffInMinutes($now);
            if ($diff < 10)
                return 1;
            else
                return 0;
        }
        else
         return 0;
  }
  public function getLastActiveAttribute(){
    $redis = Redis::connection();
      $token = Redis::get('PLAYER-TOKEN:OperatorId-' . $this->subscriber_id . '.UserId:' . $this->id);
      if ($token) {
          $token = json_decode($token);
          $token = $token->lastActiveAt;
          $dt = date("Y-m-d H:i:s", substr($token, 0, 10));
          return $dt;
      }
      else
       return 0;
}
}
