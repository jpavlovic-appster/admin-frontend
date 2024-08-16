<?php

namespace App\Models\Reports;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PlayerReport extends Model
{
    use HasFactory;
    private $adminUsers = 'admin_users';
    private $adminRoles = 'admin_roles';
    private $adminUsersAdminRoles = 'admin_users_admin_roles';

    public static function getTenantOwners($tenantID)
    {

        $Obj = new self();

        $record = DB::table("{$Obj->adminUsers} as AU")
            ->join("{$Obj->adminUsersAdminRoles} as AUAR", 'AUAR.admin_user_id', '=', 'AU.id')
            ->join("{$Obj->adminRoles} AS AR", 'AUAR.admin_role_id', '=', 'AR.id')
            ->select('AU.first_name', 'AU.last_name', 'AU.id as tenant_id')
            ->where('AR.name', 'owner')
            ->where('AU.id', $tenantID)
            ->get();

        return $record->toArray();
    }

    public static function getAdminUserHierarchy($startWithId, $tenantID)
    {
        $sql = 'WITH RECURSIVE cte_query AS
              (
                SELECT id, first_name, last_name, parent_id, tenant_id
                FROM admin_users
                WHERE parent_id = ' . $startWithId . ' and tenant_id =' . $tenantID . '

                UNION

                SELECT e.id, e.first_name, e.last_name, e.parent_id, e.tenant_id
                FROM admin_users as e
                INNER JOIN cte_query c ON c.id = e.parent_id  and e.tenant_id =' . $tenantID . '
              )
          SELECT * FROM cte_query';
        $admin_users = DB::select($sql);

        return $admin_users;

    }

    public static function getAdminUserHierarchyForOwner($tenantID)
    {
        $sql = '
          SELECT id, first_name, last_name 
          FROM admin_users WHERE tenant_id =' . $tenantID;
        $admin_users = DB::select($sql);

        return $admin_users;

    }

}
