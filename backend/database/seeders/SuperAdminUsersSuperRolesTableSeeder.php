<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SuperAdminUsersSuperRolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('super_admin_users_super_roles')->delete();
        
        \DB::table('super_admin_users_super_roles')->insert(array (
            0 => 
            array (
                'super_admin_user_id' => 4,
                'super_role_id' => 4,
            ),
           
        ));
        //
    }
}
