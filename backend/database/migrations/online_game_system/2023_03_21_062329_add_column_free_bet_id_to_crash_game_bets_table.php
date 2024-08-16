<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnFreeBetIdToCrashGameBetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_bets', function (Blueprint $table) {
            $table->BigInteger('free_bet_id')->nullable(true);
            $table->foreign(['free_bet_id'], 'crash_game_bets_fk_free_bet_id')->references(['id'])->on('online_game_system.free_bets');
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
            $table->dropColumn('free_bet_id');
        });
    }
}
