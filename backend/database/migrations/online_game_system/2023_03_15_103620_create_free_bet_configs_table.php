<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFreeBetConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_game_system.free_bet_configs', function (Blueprint $table) {
            $table->id();
            $table->BigInteger('subscriber_id')->nullable(false)->unique();
            $table->foreign(['subscriber_id'], 'free_bet_configs_fk')->references(['id'])->on('subscriber_system.subscribers');
            $table->integer('expiry_free_bet_rain')->nullable(false);
            $table->integer('minimum_multiplier')->nullable(false);
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
        Schema::dropIfExists('online_game_system.free_bet_configs');
    }
}
