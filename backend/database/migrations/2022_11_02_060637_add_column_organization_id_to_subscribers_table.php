<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnOrganizationIdToSubscribersTable extends Migration
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
        $table->bigInteger('organization_id')->nullable(true);
        $table->foreign(['organization_id'], 'subscribers_fk_1')->references(['id'])->on('organizations');

    });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subscribers', function (Blueprint $table) {
            //
            $table->dropColumn('organization_id');
        });
    }
}
