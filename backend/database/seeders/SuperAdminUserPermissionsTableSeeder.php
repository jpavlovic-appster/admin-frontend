<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SuperAdminUserPermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('super_admin_user_permissions')->delete();
        
        \DB::table('super_admin_user_permissions')->insert(array (
            0 => 
            array (
                'id' => 26,
                'super_admin_user_id' => 4,
                'action' => 'themes',
                'permission' => json_encode(["C", "R", "U"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            1 => 
            array (
                'id' => 27,
                'super_admin_user_id' => 4,
                'action' => 'currencies',
                'permission' => json_encode(["C", "R", "U", "mark_primary"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            2 => 
            array (
                'id' => 28,
                'super_admin_user_id' => 4,
                'action' => 'admins',
                'permission' => json_encode(["C", "R", "U", "D"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            3 => 
            array (
                'id' => 29,
                'super_admin_user_id' => 4,
                'action' => 'tenant_credentials',
                'permission' => json_encode(["R", "U"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            4 => 
            array (
                'id' => 30,
                'super_admin_user_id' => 4,
                'action' => 'tenant_configurations',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            5 => 
            array (
                'id' => 31,
                'super_admin_user_id' => 4,
                'action' => 'tenant_settings',
                'permission' => json_encode(["R", "U"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            6 => 
            array (
                'id' => 34,
                'super_admin_user_id' => 4,
                'action' => 'bet_history',
                'permission' => json_encode(["R", "bet_settlement"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            7 => 
            array (
                'id' => 35,
                'super_admin_user_id' => 4,
                'action' => 'fantasy_contests',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            8 => 
            array (
                'id' => 36,
                'super_admin_user_id' => 4,
                'action' => 'fantasy_matches',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            9 => 
            array (
                'id' => 37,
                'super_admin_user_id' => 4,
                'action' => 'fantasy_players',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            10 => 
            array (
                'id' => 38,
                'super_admin_user_id' => 4,
                'action' => 'fantasy_teams',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            11 => 
            array (
                'id' => 39,
                'super_admin_user_id' => 4,
                'action' => 'sports_betting_sports',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            12 => 
            array (
                'id' => 40,
                'super_admin_user_id' => 4,
                'action' => 'sports_betting_tournaments',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            13 => 
            array (
                'id' => 41,
                'super_admin_user_id' => 4,
                'action' => 'sports_betting_matches',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            14 => 
            array (
                'id' => 42,
                'super_admin_user_id' => 4,
                'action' => 'sports_betting_markets',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            15 => 
            array (
                'id' => 43,
                'super_admin_user_id' => 4,
                'action' => 'sports_betting_countries',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            16 => 
            array (
                'id' => 44,
                'super_admin_user_id' => 4,
                'action' => 'affiliates',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            17 => 
            array (
                'id' => 45,
                'super_admin_user_id' => 4,
                'action' => 'crm',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            18 => 
            array (
                'id' => 46,
                'super_admin_user_id' => 4,
                'action' => 'cms',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            19 => 
            array (
                'id' => 47,
                'super_admin_user_id' => 4,
                'action' => 'advertisements',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            20 => 
            array (
                'id' => 48,
                'super_admin_user_id' => 4,
                'action' => 'subscribers',
                'permission' => json_encode(["R", "C", "U", "disable"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            21 => 
            array (
                'id' => 49,
                'super_admin_user_id' => 4,
                'action' => 'slot_games',
                'permission' => json_encode(["R", "disable"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            22 => 
            array (
                'id' => 59,
                'super_admin_user_id' => 4,
                'action' => 'tenant_packages',
                'permission' => json_encode(["R", "U"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            23 => 
            array (
                'id' => 60,
                'super_admin_user_id' => 4,
                'action' => 'subscriber_packages',
                'permission' => json_encode(["R", "U"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            24 => 
            array (
                'id' => 61,
                'super_admin_user_id' => 4,
                'action' => 'subscriber_settings',
                'permission' => json_encode(["R", "U"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            25 => 
            array (
                'id' => 62,
                'super_admin_user_id' => 4,
                'action' => 'subscriber_credentials',
                'permission' => json_encode(["R", "U"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            26 => 
            array (
                'id' => 25,
                'super_admin_user_id' => 4,
                'action' => 'tenants',
                'permission' => json_encode(["C", "R", "U", "disable"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            27 => 
            array (
                'id' => 64,
                'super_admin_user_id' => 4,
                'action' => 'sport_transactions',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            28 => 
            array (
                'id' => 32,
                'super_admin_user_id' => 4,
                'action' => 'users',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            29 => 
            array (
                'id' => 33,
                'super_admin_user_id' => 4,
                'action' => 'transactions',
                'permission' => json_encode(["R", "deposit", "withdrawal"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            30 => 
            array (
                'id' => 80,
                'super_admin_user_id' => 4,
                'action' => 'crash_game',
                'permission' => json_encode(["R"]),
                'created_at' => '2021-10-21 19:46:25.000',
                'updated_at' => '2021-10-21 19:46:25.000'
            ),
            
        ));
        //
    }
}
