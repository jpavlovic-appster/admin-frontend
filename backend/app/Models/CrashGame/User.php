<?php

namespace App\Models\CrashGame;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $table="online_game_system.users";

    protected $fillable = [
        'user_id',
        'user_unique_id',
        'tenant_user_id',
        'tenant_admin_user_id',
        'subscriber_user_id',
        'subscriber_admin_user_id',
        'status'
    ];
}
