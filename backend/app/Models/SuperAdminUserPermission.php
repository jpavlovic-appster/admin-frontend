<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuperAdminUserPermission extends Model
{
    use HasFactory;

    protected $table = 'public.super_admin_user_permissions';

    protected $fillable = ['super_admin_user_id', 'action', 'permission'];
}
