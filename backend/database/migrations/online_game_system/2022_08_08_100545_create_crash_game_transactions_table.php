<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrashGameTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->id();
            $table->BigInteger('user_id')->nullable(false);
            $table->string('transaction_hash')->nullable(true);
            $table->BigInteger('round_id')->nullable(true);
            $table->float('auto_rate')->nullable(true)->default(0.0);
            $table->float('escape_rate')->nullable(true)->default(0.0);
            $table->float('bet_amount')->nullable(true)->default(0.0);
            $table->float('winning_amount')->nullable(true)->default(0.0);
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
        Schema::dropIfExists('online_game_system.crash_game_transactions');
    }
}
