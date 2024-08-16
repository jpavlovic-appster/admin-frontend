<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CrashGameGlobalSettingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      \DB::table('online_game_system.crash_game_global_settings')->delete();

        \DB::table('online_game_system.crash_game_global_settings')->insert(array (
            0 =>
            array (
                'id' => 1,
                'house_edge' => 4.0,
                'min_odds' => 1.0,
                'max_odds' => 20.0,
                'min_auto_rate' => 1.01,
                'betting_period' => 8
            ),

        ));
        //
    }
}
