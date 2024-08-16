<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserBrowserSessionDataTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscriber_system.user_browser_session_data', function (Blueprint $table) {
            $table->id();
            $table->BigInteger('user_id')->nullable(false);
            $table->foreign(['user_id'], 'user_browser_session_data_fk')->references(['id'])->on('subscriber_system.users');
            $table->string('ip_address')->nullable(true);
            $table->string('browser_name')->nullable(true);
            $table->string('browser_version')->nullable(true);
            $table->string('device_type')->nullable(true);
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscriber_system.user_browser_session_data');
    }
}
