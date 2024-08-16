<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeFkFromUsersToSubUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_bets', function (Blueprint $table) {
            $table->dropForeign('crash_game_bets_fk');
            $table->foreign(['user_id'], 'crash_game_bets_fk')->references(['id'])->on('subscriber_system.users');
        });
        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->dropForeign('crash_game_transactions_fk');
            $table->foreign(['user_id'], 'crash_game_transactions_fk')->references(['id'])->on('subscriber_system.users');
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
    }
}
