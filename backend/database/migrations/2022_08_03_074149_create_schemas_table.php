<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSchemasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // \DB::statement(\DB::raw("CREATE SCHEMA IF NOT EXISTS dfs;"));
        // \DB::statement(\DB::raw("CREATE SCHEMA IF NOT EXISTS slot_system;"));
        // // \DB::statement(\DB::raw("CREATE SCHEMA IF NOT EXISTS sports_betting;"));
        // \DB::statement(\DB::raw("CREATE SCHEMA IF NOT EXISTS multi_tenant_system;"));
        \DB::statement(\DB::raw("CREATE SCHEMA IF NOT EXISTS subscriber_system;"));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::dropIfExists('dfs');
        // Schema::dropIfExists('slot_system');
        // Schema::dropIfExists('sports_betting');
        // Schema::dropIfExists('multi_tenant_system');
        Schema::dropIfExists('subscriber_system');
    }
}
