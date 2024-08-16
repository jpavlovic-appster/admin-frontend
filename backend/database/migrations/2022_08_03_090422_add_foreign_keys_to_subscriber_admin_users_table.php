<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToSubscriberAdminUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscriber_system.admin_users', function (Blueprint $table) {
            $table->foreign(['subscriber_id'], 'admin_users_fk')->references(['id'])->on('subscriber_system.subscribers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subscriber_system.admin_users', function (Blueprint $table) {
            $table->dropForeign('admin_users_fk');
        });
    }
}
