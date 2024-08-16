<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFreeBetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_game_system.free_bets', function (Blueprint $table) {
            $table->id();
            $table->BigInteger('user_id')->nullable(false)->unique();
            $table->foreign(['user_id'], 'free_bets_fk')->references(['id'])->on('subscriber_system.users');
            $table->string('currency_code')->nullable(false);
            $table->float('bet_amount')->nullable(false);
            $table->integer('num_of_free_bets')->nullable(false);
            $table->timestamp('end_date')->nullable(false);
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
        Schema::dropIfExists('online_game_system.free_bets');
    }
}
