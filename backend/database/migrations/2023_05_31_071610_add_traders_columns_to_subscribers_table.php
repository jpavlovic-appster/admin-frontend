<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTradersColumnsToSubscribersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscriber_system.subscribers', function (Blueprint $table) {
            //
            $table->string('trader_preference')->nullable(true);
            $table->bigInteger('trader_id')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subscriber_system.subscribers', function (Blueprint $table) {
            //
            $table->dropColumn('trader_preference');
            $table->dropColumn('trader_id');
        });
    }
}
