<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToSubscriberUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscriber_system.users', function (Blueprint $table) {
            $table->foreign(['subscriber_id'], 'users_fk')->references(['id'])->on('subscriber_system.subscribers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subscriber_system.users', function (Blueprint $table) {
            $table->dropForeign('users_fk');
        });
    }
}
