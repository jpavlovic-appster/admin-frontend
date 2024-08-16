<?php

namespace App\Models\SubscriberSystem;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriberAdminUsersAdminRoles extends Model
{
    use HasFactory;

    protected $table="subscriber_system.admin_users_admin_roles";

    protected $primaryKey = null;
    public $incrementing = false;

    protected $fillable = [
        'admin_user_id',
        'admin_role_id'
    ];

    public $timestamps = false;

}
