<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToCrashGameTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->foreign(['user_id'], 'crash_game_transactions_fk')->references(['id'])->on('subscriber_system.users');
            $table->foreign(['round_id'], 'crash_game_transactions_fk_1')->references(['id'])->on('online_game_system.crash_game_round_details');
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
            $table->dropForeign('crash_game_transactions_fk');
            $table->dropForeign('crash_game_transactions_fk_1');
        });
    }
}
