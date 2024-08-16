<?php

namespace App\Models\SubscriberSystem;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriberAdminUserPermission extends Model
{
    use HasFactory;

    protected $table = "subscriber_system.admin_user_permissions";

    protected $fillable = ['admin_user_id', 'action', 'permission'];
}
