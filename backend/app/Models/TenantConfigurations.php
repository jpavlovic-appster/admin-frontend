<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class TenantConfigurations extends Model
{
    use HasFactory;
    use SoftDeletes;
    // protected $table="multi_tenant_system.tenant_configurations";
    protected $table="online_game_system.crash_game_configurations";

    protected $fillable = [
        'tenant_id',
        'subscriber_id',
        'multi_bet',
        'hero_json',
        'hero_png',
        'bg_json',
        'bg_png',
        'graph',
        'bg_sound',
        'start_sound',
        'flew_away_sound',
        'start_anim_json',
        'start_anim_png',
        'crash_anim_json',
        'crash_anim_png',
        'loader_anim_json',
        'loader_anim_png',
        'graph_colour',
        'loader_colour',
        'allowed_currencies',
        'created_at',
        'updated_at'
    ];
}
