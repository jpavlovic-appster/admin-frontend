<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveForeignKeyRoundIdCrashgameTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_bets', function (Blueprint $table) {
            $table->dropForeign('crash_game_bets_fk_1');
    
            
        });

        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->dropForeign('crash_game_transactions_fk_1');
    
            
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
        
        //
    }
}
