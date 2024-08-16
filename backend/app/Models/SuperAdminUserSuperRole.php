<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuperAdminUserSuperRole extends Model
{
    use HasFactory;

    protected $table = 'public.super_admin_users_super_roles';

    protected $primaryKey = null;
    public $incrementing = false;

    protected $fillable = [
        'super_admin_user_id',
        'super_role_id'
    ];

    public $timestamps = false;
}
