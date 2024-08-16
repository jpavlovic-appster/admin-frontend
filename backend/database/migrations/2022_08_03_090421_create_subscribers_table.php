<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubscribersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscriber_system.subscribers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('subscriber_name')->nullable();
            $table->timestampTz('created_at')->nullable();
            $table->timestampTz('modified_at')->nullable();
            $table->smallInteger('status')->nullable()->comment('0-inactive, 1-active, 2-subscription expire');
            $table->integer('super_admin_user_id')->nullable();
            $table->string('primary_currency')->nullable();
            $table->string('secret_key')->nullable();
            $table->string('domain')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscriber_system.subscribers');
    }
}
