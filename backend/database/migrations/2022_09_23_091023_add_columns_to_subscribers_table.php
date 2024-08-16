<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToSubscribersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscriber_system.subscribers', function (Blueprint $table) {
            //
            $table->string('auth')->nullable(true);
            $table->string('credit')->nullable(true);
            $table->string('debit')->nullable(true);
            $table->string('rollback')->nullable(true);
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
            //
            $table->dropColumn('auth');
            $table->dropColumn('credit');
            $table->dropColumn('debit');
            $table->dropColumn('rollback');
        });
    }
}
