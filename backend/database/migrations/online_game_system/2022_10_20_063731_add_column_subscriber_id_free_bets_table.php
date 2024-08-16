<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnSubscriberIdFreeBetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('online_game_system.free_bets', function (Blueprint $table) {
        //
        $table->BigInteger('subscriber_id')->nullable(false);
        $table->foreign(['subscriber_id'], 'free_bets_fk1')->references(['id'])->on('subscriber_system.subscribers');

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
      Schema::table('online_game_system.free_bets', function (Blueprint $table) {
        //
        $table->dropColumn('subscriber_id');
    });
        //
    }
}
