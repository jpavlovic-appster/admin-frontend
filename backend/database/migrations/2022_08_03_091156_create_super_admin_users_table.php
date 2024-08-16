<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSuperAdminUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('super_admin_users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->default('')->unique('index_super_admin_users_on_email');
            $table->string('encrypted_password')->default('');
            $table->string('reset_password_token')->nullable()->unique('index_super_admin_users_on_reset_password_token');
            $table->timestamp('reset_password_sent_at')->nullable();
            $table->timestamp('remember_created_at')->nullable();
            $table->string('parent_type')->nullable();
            $table->bigInteger('parent_id')->nullable();
            $table->timestamp('created_at', 6);
            $table->timestamp('updated_at', 6);
            $table->string('remember_token')->nullable();
            $table->boolean('active')->nullable();
            $table->string('agent_name');
            $table->string('phone');

            $table->unique(['email'], 'super_admin_users_un');
            $table->index(['parent_type', 'parent_id'], 'index_super_admin_users_on_parent_type_and_parent_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('super_admin_users');
    }
}
