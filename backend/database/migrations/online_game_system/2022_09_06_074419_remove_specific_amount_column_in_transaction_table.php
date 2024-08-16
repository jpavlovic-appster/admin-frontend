<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveSpecificAmountColumnInTransactionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            //
            $table->renameColumn('winning_amount', 'amount');
            $table->dropColumn('bet_amount');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            //
            $table->renameColumn('amount', 'winning_amount');
            $table->float('bet_amount')->nullable(true)->default(0.0);
        });
    }
}
