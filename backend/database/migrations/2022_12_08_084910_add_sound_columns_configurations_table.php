<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSoundColumnsConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('configurations', function (Blueprint $table) {
            $table->string('start_sound')->nullable(true);
            $table->string('bg_sound')->nullable(true);
            $table->string('flew_away_sound')->nullable(true);
              //
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
        Schema::table('configurations', function (Blueprint $table) {
            //
            $table->dropColumn('start_sound');
            $table->dropColumn('bg_sound');
            $table->dropColumn('flew_away_sound');
        });
        //
    }
}
