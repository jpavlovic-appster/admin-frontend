<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AlterDatatypeRoundIdCrashgameTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::update('alter table online_game_system.crash_game_bets 
        // alter round_id TYPE VARCHAR(200)');

        // DB::update(`alter table online_game_system.crash_game_bets
        // add constraint round_unique unique (round_id)`);

        Schema::table('online_game_system.crash_game_round_details', function (Blueprint $table) {
            $table->string('round_id')->unique()->change();
         });

        Schema::table('online_game_system.crash_game_bets', function (Blueprint $table) {
            $table->string('round_id')->change();
         });

         Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->string('round_id')->change();
         });
        //
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('online_game_system.crash_game_bets', function (Blueprint $table) {
            $table->string('round_id')->unique()->change();
         });

         Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->string('round_id')->unique()->change();
         });
        //
    }
}
