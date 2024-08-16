<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToCrashGameSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_settings', function (Blueprint $table) {
            //
            $table->bigInteger('subscriber_id')->nullable(true);
            $table->foreign(['subscriber_id'], 'settings_fk_1')->references(['id'])->on('subscriber_system.subscribers');
    
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('online_game_system.crash_game_settings', function (Blueprint $table) {
            //
            $table->dropColumn('subscriber_id');
        });
    }
}
