<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSuperAdminUsersSuperRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('super_admin_users_super_roles', function (Blueprint $table) {
            $table->bigInteger('super_admin_user_id')->nullable()->index('index_super_admin_users_super_roles_on_super_admin_user_id');
            $table->bigInteger('super_role_id')->nullable()->index('index_super_admin_users_super_roles_on_super_role_id');

            $table->index(['super_admin_user_id', 'super_role_id'], 'index_super_admin_users_roles_on_super_admin_users_and_roles');
            $table->unique(['super_admin_user_id', 'super_role_id'], 'super_admin_users_super_roles_un');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('super_admin_users_super_roles');
    }
}
