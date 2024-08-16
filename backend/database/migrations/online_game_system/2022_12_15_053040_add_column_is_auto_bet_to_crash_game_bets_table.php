<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnIsAutoBetToCrashGameBetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_bets', function (Blueprint $table) {
            //
            $table->boolean('is_auto_bet')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('online_game_system.crash_game_bets', function (Blueprint $table) {
            //
            $table->dropColumn('is_auto_bet');
        });
    }
}
