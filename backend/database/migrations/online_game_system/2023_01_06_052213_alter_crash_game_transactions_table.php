<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterCrashGameTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->string('return_code')->nullable(true);
            $table->string('return_phrase')->nullable(true);
            $table->dropColumn('return_reason');
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
        Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->dropColumn('return_code');
            $table->dropColumn('return_phrase');
            $table->string('return_reason')->nullable(true);

              //
          });
        //
    }
}
