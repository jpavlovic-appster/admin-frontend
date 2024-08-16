<?php

namespace App\Models\SubscriberSystem;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

use App\Models\SubscriberSystem\SubscriberAdminUserPermission;
use App\Models\SubscriberSystem\SubscriberAdminUsersAdminRoles;
use App\Models\SubscriberSystem\SubscriberAdminRole;

use Illuminate\Database\Eloquent\SoftDeletes;

class SubscriberAdmin extends Authenticatable {

    use HasFactory, HasApiTokens, Notifiable, SoftDeletes;

    protected $table="subscriber_system.admin_users";

    protected $fillable = [
        'first_name',
        'last_name',
        'agent_name',
        'phone',
        'parent_type',
        'parent_id',
        'subscriber_id',
        'email',
        'password',
        'active',
        'reset_password_token',
        'reset_password_sent_at'
    ];

    protected $appends = ['permissions'];

    public function role() {
        return $this->belongsToMany(SubscriberAdminRole::class, (new SubscriberAdminUsersAdminRoles)->getTable(), 'admin_user_id', 'admin_role_id');
    }

    public function getPermissionsAttribute(){

        $rawPermissions = SubscriberAdminUserPermission::where('admin_user_id', $this->id)
        ->get();

        $permissions = [];

        foreach($rawPermissions as $permission){
            $permissions[$permission->action] = json_decode($permission->permission);
        }

        return $permissions;
    }

}
