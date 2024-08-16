<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToSubscriberUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('subscriber_system.users', function (Blueprint $table) {
        //
        $table->string('name',50)->nullable(true);
        $table->string('nick_name',50)->nullable(true);
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
        //
        $table->dropColumn('name');
        $table->dropColumn('nick_name');
    });
    }
}
