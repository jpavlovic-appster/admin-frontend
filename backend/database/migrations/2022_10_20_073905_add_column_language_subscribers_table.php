<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnLanguageSubscribersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('subscriber_system.subscribers', function (Blueprint $table) {
        $table->string('language')->nullable(true);

    });
        //
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
          $table->dropColumn('language');
      });
        //
    }
}
