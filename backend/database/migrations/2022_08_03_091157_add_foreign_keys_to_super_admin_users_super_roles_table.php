<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToSuperAdminUsersSuperRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('super_admin_users_super_roles', function (Blueprint $table) {
            $table->foreign(['super_admin_user_id'], 'super_admin_users_super_roles_fk')->references(['id'])->on('super_admin_users');
            $table->foreign(['super_role_id'], 'super_admin_users_super_roles_fk_1')->references(['id'])->on('super_roles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('super_admin_users_super_roles', function (Blueprint $table) {
            $table->dropForeign('super_admin_users_super_roles_fk');
            $table->dropForeign('super_admin_users_super_roles_fk_1');
        });
    }
}
