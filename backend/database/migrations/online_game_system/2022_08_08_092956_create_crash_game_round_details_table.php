<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrashGameRoundDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_game_system.crash_game_round_details', function (Blueprint $table) {
            $table->id();
            $table->string('round_id')->nullable(true);
            $table->float('crash_rate')->nullable(true);
            $table->string('round_state')->nullable(true);
            $table->string('round_hash')->nullable(true);
            $table->string('round_signature')->nullable(true);
            $table->timestamp('on_hold_at')->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('online_game_system.crash_game_round_details');
    }
}
