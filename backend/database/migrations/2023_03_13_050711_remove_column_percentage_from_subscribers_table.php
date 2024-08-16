<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveColumnPercentageFromSubscribersTable extends Migration
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
            $table->dropColumn('percentage');
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
            $table->float('percentage')->nullable(true);
        });
    }
}
