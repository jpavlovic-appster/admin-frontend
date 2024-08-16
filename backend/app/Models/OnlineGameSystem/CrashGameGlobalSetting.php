<?php

namespace App\Models\OnlineGameSystem;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrashGameGlobalSetting extends Model
{
  use HasFactory;
  protected $table="online_game_system.crash_game_global_settings";

  protected $fillable = [
      "id",
      "max_odds",
      "min_odds",
      "house_edge",
      "min_auto_rate",
      "betting_period",
  ];
}
