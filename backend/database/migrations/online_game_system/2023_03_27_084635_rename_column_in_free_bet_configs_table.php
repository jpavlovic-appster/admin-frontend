<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameColumnInFreeBetConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.free_bet_configs', function (Blueprint $table) {
            //
            $table->renameColumn('check_bet_time_before_claim', 'check_bet_time_before_claim_in_minutes');
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
            //
            $table->renameColumn('check_bet_time_before_claim_in_minutes', 'check_bet_time_before_claim');
        });
    }
}
