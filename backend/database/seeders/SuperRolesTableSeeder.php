<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SuperRolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('super_roles')->delete();
        
        \DB::table('super_roles')->insert(array (
            0 => 
            array (
                'id' => 4,
                'name' => 'Super Admin',
                'created_at' => '2021-10-06 11:15:07.641',
                'updated_at' => '2021-10-06 11:15:07.641',
                'abbr' => 'super_admin',
                'level' => 1
            ),
            1 => 
            array (
                'id' => 5,
                'name' => 'Admin',
                'created_at' => '2021-10-06 11:15:07.641',
                'updated_at' => '2021-10-06 11:15:07.641',
                'abbr' => 'admin',
                'level' => 2
            ),
            2 => 
            array (
                'id' => 6,
                'name' => 'Support Staff',
                'created_at' => '2021-10-06 11:15:07.641',
                'updated_at' => '2021-10-06 11:15:07.641',
                'abbr' => 'support_staff',
                'level' => 3
            ),

            
        ));

    }
        //
    
}
