<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SubscriberAdminRolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('subscriber_system.admin_roles')->delete();
        
        \DB::table('subscriber_system.admin_roles')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Admin',
                'created_at' => '2022-01-21 11:31:04.604',
                'updated_at' => '2022-01-21 11:31:04.604' ,
                'abbr' => 'admin',
                'level' => 1,
            ),
            
        ));
        //
    }
}
