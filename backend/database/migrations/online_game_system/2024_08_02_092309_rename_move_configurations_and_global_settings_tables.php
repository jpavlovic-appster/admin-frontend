<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameMoveConfigurationsAndGlobalSettingsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      DB::statement('ALTER TABLE public.configurations SET SCHEMA online_game_system');
      DB::statement('ALTER TABLE online_game_system.configurations RENAME TO crash_game_configurations');
      DB::statement('ALTER TABLE online_game_system.global_settings RENAME TO crash_game_global_settings');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      DB::statement('ALTER TABLE online_game_system.crash_game_configurations SET SCHEMA public');
      DB::statement('ALTER TABLE public.crash_game_configurations RENAME TO configurations');
      DB::statement('ALTER TABLE online_game_system.crash_game_global_settings RENAME TO global_settings');
    }
}
