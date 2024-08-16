<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrashGameSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('online_game_system.crash_game_settings', function (Blueprint $table) {
            $table->id();
            $table->jsonb('min_bet')->default('{}')->nullable(true);
            $table->jsonb('max_bet')->default('{}')->nullable(true);
            $table->jsonb('max_profit')->default('{}')->nullable(true);
            $table->float('house_edge')->default(4.0)->nullable(true);
            $table->float('min_odds')->default(1.0)->nullable(true);
            $table->float('max_odds')->nullable(true)->default(20.0);
            $table->float('min_auto_rate')->nullable(true)->default(1.01);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('online_game_system.crash_game_settings');
    }
}
