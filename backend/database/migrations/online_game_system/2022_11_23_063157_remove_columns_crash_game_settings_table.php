<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveColumnsCrashGameSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('online_game_system.crash_game_settings', function (Blueprint $table) {
        //
        $table->dropColumn('house_edge');
        $table->dropColumn('min_odds');
        $table->dropColumn('max_odds');
        $table->dropColumn('min_auto_rate');
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

      Schema::table('online_game_system.crash_game_settings', function (Blueprint $table) {
        //
            $table->float('house_edge')->default(4.0)->nullable(true);
            $table->float('min_odds')->default(1.0)->nullable(true);
            $table->float('max_odds')->nullable(true)->default(20.0);
            $table->float('min_auto_rate')->nullable(true)->default(1.01);
        //
      });
    }
}
