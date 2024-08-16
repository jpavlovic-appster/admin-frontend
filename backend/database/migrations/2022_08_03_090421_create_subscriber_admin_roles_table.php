<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubscriberAdminRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscriber_system.admin_roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('resource_type')->nullable();
            $table->bigInteger('resource_id')->nullable();
            $table->timestamp('created_at', 6);
            $table->timestamp('updated_at', 6);
            $table->string('abbr')->nullable();
            $table->smallInteger('level');

            $table->index(['name', 'resource_type', 'resource_id'], 'index_admin_roles_on_name_and_resource_type_and_resource_id');
            $table->index(['resource_type', 'resource_id'], 'index_admin_roles_on_resource_type_and_resource_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscriber_system.admin_roles');
    }
}
