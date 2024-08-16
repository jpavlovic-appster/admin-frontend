<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\HasApiTokens;

class Super extends Authenticatable
{
    use HasFactory,HasApiTokens,HasFactory, Notifiable;
    /**
     * @var string
     */
    protected $table="public.super_admin_users";

    /**
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * @return mixed|string
     */
    public function getAuthPassword()
    {
        return $this->encrypted_password;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'encrypted_password',
        'parent_type',
        'parent_id',
        'remember_token',
        'agent_name',
        'active',
        'phone'
    ];

    protected $appends = ['permissions'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'encrypted_password',
        'remember_token',
    ];

    public function role(){
        return $this->belongsToMany(SuperRole::class, (new SuperAdminUserSuperRole)->getTable(), 'super_admin_user_id', 'super_role_id');
    }

    public function parent(){
        return $this->belongsTo(Super::class, 'parent_id', 'id');
    }
    // public function getWalletsAttribute() {
    //     return Wallets::where('owner_id', $this->id)->where('owner_type', SUPER_ADMIN_TYPE)->get();
    // }


    public function getPermissionsAttribute(){

        $rawPermissions = SuperAdminUserPermission::where('super_admin_user_id', $this->id)
        ->get();

        $permissions = [];

        foreach($rawPermissions as $permission){
            $permissions[$permission->action] = json_decode($permission->permission);
        }

        return $permissions;
    }
    public static function getSuperAdminUserHierarchy($startWithId) {

        $user = Auth::User();
        $sql = 'WITH RECURSIVE cte_query AS
              (
                SELECT id, email, parent_type, parent_id,  \''.SUPER_ADMIN_TYPE.'\' as type FROM '.(new self)->table.' as m WHERE id = ' . $startWithId . ' 

                UNION

                SELECT e.id, e.email, e.parent_type, e.parent_id, \''.SUPER_ADMIN_TYPE.'\' as type FROM '.(new self)->table.' as e
                INNER JOIN cte_query c ON c.parent_id = e.id and c.id <> ' . $user->id . ' 
              )
          SELECT * FROM cte_query';

        $super_admin_users = DB::select($sql);

        return $super_admin_users;
    }

}
