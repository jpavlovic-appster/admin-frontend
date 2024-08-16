<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubscriberAdminUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscriber_system.admin_users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('phone_verified')->nullable()->default(false);
            $table->string('parent_type')->nullable();
            $table->bigInteger('parent_id')->nullable();
            $table->string('email')->default('')->unique('index_admin_users_on_email');
            $table->string('password')->default('');
            $table->string('reset_password_token')->nullable()->unique('index_admin_users_on_reset_password_token');
            $table->timestamp('reset_password_sent_at')->nullable();
            $table->timestamp('remember_created_at')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->bigInteger('subscriber_id')->nullable()->index('index_admin_users_on_subscriber_id');
            $table->string('agent_name')->nullable();
            $table->boolean('active')->nullable()->default(true);
            $table->string('remember_token')->nullable();

            $table->index(['parent_type', 'parent_id'], 'index_admin_users_on_parent_type_and_parent_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscriber_system.admin_users');
    }
}
