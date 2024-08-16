<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnOnHoldAtToCrashGameRoundDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_round_details', function (Blueprint $table) {
            $table->timestampTz('on_hold_at')->nullable(true);   
              });
    
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('online_game_system.crash_game_round_details', function (Blueprint $table) {
            $table->dropColumn('on_hold_at');
            // $table->timestamp('on_hold_at')->nullable(true);   
              });

    }
}
