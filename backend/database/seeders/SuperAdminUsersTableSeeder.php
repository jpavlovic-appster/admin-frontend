<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SuperAdminUsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('super_admin_users')->delete();
        
        \DB::table('super_admin_users')->insert(array (
            0 => 
            array (
                'id' => 4,
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'admin@acegaming.com',
                'encrypted_password' => '$2a$12$sWukpTGzZUC1cyi5SMAmE.Pzk2Mjqi6eiPwxHWtT6yQ7v0htw6g9.',
                'parent_type' => 'SuperAdminUser',
                'parent_id' => 1,
                'created_at' => '2021-03-01 12:22:59.556',
                'updated_at' => '2021-03-01 12:22:59.560',
                'remember_token' => 'sFTLKMmhv3YBLos8NsEWKkez3CvJDVEJJD0CeQwCwAe6KbXyWzxQR3PNmhtY',
                'active' => true,
                'agent_name' => 'superadmin',
                'phone' => '9854251252'
            ),
           
        ));
        
        
    }
        //
    
}
