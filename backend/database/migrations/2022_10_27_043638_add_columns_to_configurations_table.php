<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('configurations', function (Blueprint $table) {
          $table->string('hero_json')->nullable(true);
          $table->string('hero_png')->nullable(true);
          $table->string('bg_json')->nullable(true);
          $table->string('bg_png')->nullable(true);
          $table->smallInteger('graph')->nullable(true)->comment('0-hide, 1-show');
            //
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('configurations', function (Blueprint $table) {
            //
            $table->dropColumn('hero_json');
            $table->dropColumn('hero_png');
            $table->dropColumn('bg_json');
            $table->dropColumn('bg_png');
            $table->dropColumn('graph');
        });
    }
}
