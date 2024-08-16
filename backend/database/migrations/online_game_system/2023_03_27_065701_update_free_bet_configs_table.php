<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFreeBetConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.free_bet_configs', function (Blueprint $table) {
            $table->dropColumn('minimum_multiplier');
            $table->dropColumn('expiry_free_bet_rain');
            $table->integer('check_bet_time_before_claim')->nullable(false)->default(30);
            $table->float('check_bet_amount_before_claim')->nullable(false)->default(5);
              });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('online_game_system.free_bet_configs', function (Blueprint $table) {
        $table->integer('expiry_free_bet_rain')->nullable(false);
        $table->integer('minimum_multiplier')->nullable(false);
        $table->dropColumn('check_bet_time_before_claim');
        $table->dropColumn('check_bet_amount_before_claim');
        //
    });
    }
}
