<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMoreColumnsToFreeBetRainsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.free_bet_rains', function (Blueprint $table) {
            //
            $table->integer('check_bet_time_before_claim_in_minutes')->nullable(false)->default(30);
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
        Schema::table('online_game_system.free_bet_rains', function (Blueprint $table) {
            //
            $table->dropColumn('check_bet_time_before_claim_in_minutes');
            $table->dropColumn('check_bet_amount_before_claim');
        });
    }
}
