<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnFreeBetRainIdToFreeBetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.free_bets', function (Blueprint $table) {
            //
            $table->BigInteger('free_bet_rain_id')->nullable(true);
            $table->foreign(['free_bet_rain_id'], 'free_bets_fk_rain')->references(['id'])->on('online_game_system.free_bet_rains');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('online_game_system.free_bets', function (Blueprint $table) {
            //
            $table->dropColumn('free_bet_rain_id');
        });
    }
}
