<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('languages', function (Blueprint $table) {
        $table->string('user_backend_json')->nullable(true);

    });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('languages', function (Blueprint $table) {
        //
        $table->dropColumn('user_backend_json');
    });
    }
}
