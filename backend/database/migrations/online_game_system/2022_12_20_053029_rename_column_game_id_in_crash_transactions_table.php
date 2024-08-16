<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameColumnGameIdInCrashTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->renameColumn('game_id', 'bet_id');
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
                $table->renameColumn('bet_id', 'game_id');
        });
    }
}
