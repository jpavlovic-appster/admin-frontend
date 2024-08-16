<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubscriberUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscriber_system.users', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('subscriber_id')->nullable();
            $table->string('user_code')->nullable()->comment('third party user identification code');
            $table->timestampTz('created_at')->nullable();
            $table->timestampTz('modified_at')->nullable();
            $table->string('currency_code')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscriber_system.users');
    }
}
