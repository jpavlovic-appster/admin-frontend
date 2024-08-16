<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToSubscribersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscriber_system.subscribers', function (Blueprint $table) {
            $table->foreign(['super_admin_user_id'], 'subscribers_fk')->references(['id'])->on('public.super_admin_users');
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
            $table->dropForeign('subscribers_fk');
        });
    }
}
