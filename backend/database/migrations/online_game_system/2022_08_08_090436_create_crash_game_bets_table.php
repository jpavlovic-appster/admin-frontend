<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrashGameBetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_game_system.crash_game_bets', function (Blueprint $table) {
            $table->id();
            $table->BigInteger('user_id')->nullable(false);
            $table->BigInteger('round_id')->nullable(true);
            $table->float('auto_rate')->nullable(true)->default(0.0);
            $table->float('escape_rate')->nullable(true)->default(0.0);
            $table->float('bet_amount')->nullable(true)->default(0.0);
            $table->float('winning_amount')->nullable(true)->default(0.0);
            $table->string('result')->nullable(true);
            $table->string('currency_code')->nullable(true);
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
        Schema::dropIfExists('onlone_game_system.crash_game_bets');
    }
}
