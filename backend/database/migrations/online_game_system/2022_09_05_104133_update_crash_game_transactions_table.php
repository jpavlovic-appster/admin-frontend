<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCrashGameTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_transactions', function($table) {
            $table->dropColumn('auto_rate');
            $table->dropColumn('escape_rate');
            $table->dropForeign('crash_game_transactions_fk_1');
            $table->dropColumn('round_id');
            $table->BigInteger('game_id')->nullable(false);
            $table->foreign(['game_id'], 'crash_game_transactions_fk2')->references(['id'])->on('online_game_system.crash_game_bets');
            $table->string('transaction_type');
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
        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->dropForeign('crash_game_transactions_fk2');
            $table->dropColumn('game_id');
            $table->dropColumn('transaction_type');
            $table->float('auto_rate')->nullable(true)->default(0.0);
            $table->float('escape_rate')->nullable(true)->default(0.0);
        });
        //
    }
}
