<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMoreColumnsToConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('configurations', function (Blueprint $table) {
            $table->string('start_anim_json')->nullable(true);
            $table->string('start_anim_png')->nullable(true);
            $table->string('crash_anim_json')->nullable(true);
            $table->string('crash_anim_png')->nullable(true);
            $table->string('loader_anim_json')->nullable(true);
            $table->string('loader_anim_png')->nullable(true);
            $table->string('graph_colour')->default('0x3586EF');
            $table->string('loader_colour')->default('0x3586EF');
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
            $table->dropColumn('start_anim_json');
            $table->dropColumn('start_anim_png');
            $table->dropColumn('crash_anim_json');
            $table->dropColumn('crash_anim_png');
            $table->dropColumn('loader_anim_json');
            $table->dropColumn('loader_anim_png');
            $table->dropColumn('graph_colour');
            $table->dropColumn('loader_colour');
              //
          });
    }
}
