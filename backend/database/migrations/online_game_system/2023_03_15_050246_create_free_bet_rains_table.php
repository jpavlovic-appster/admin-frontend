<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFreeBetRainsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_game_system.free_bet_rains', function (Blueprint $table) {
            $table->id();
            $table->BigInteger('subscriber_id')->nullable(false);
            $table->foreign(['subscriber_id'], 'free_bet_rains_fk')->references(['id'])->on('subscriber_system.subscribers');
            $table->float('bet_amount')->nullable(false);
            $table->string('currency_code')->nullable(false);
            $table->integer('num_of_free_bets')->nullable(false);
            $table->timestampTz('start_time');
            $table->timestampTz('end_time');
            $table->timestampTz('rain_start_time');
            $table->timestampTz('rain_end_time');
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
        Schema::dropIfExists('online_game_system.free_bet_rains');
    }
}
