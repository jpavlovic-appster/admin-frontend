<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToFreeBetRainsTable extends Migration
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
            $table->string('promotion_name')->nullable(true);
            $table->float('minimum_multiplier')->nullable(false)->default(2.0);
            $table->integer('expiry_after_claim')->nullable(false)->default(1);
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
            $table->dropColumn('promotion_name');
            $table->dropColumn('minimum_multiplier');
            $table->dropColumn('expiry_after_claim');
        });
    }
}
