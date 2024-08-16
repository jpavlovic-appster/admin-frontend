<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubscriberAdminUsersAdminRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscriber_system.admin_users_admin_roles', function (Blueprint $table) {
            $table->bigInteger('admin_user_id')->nullable()->index('index_admin_users_admin_roles_on_admin_user_id');
            $table->bigInteger('admin_role_id')->nullable()->index('index_admin_users_admin_roles_on_admin_role_id');

            $table->index(['admin_user_id', 'admin_role_id'], 'index_admin_users_roles_on_admin_users_roles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscriber_system.admin_users_admin_roles');
    }
}
