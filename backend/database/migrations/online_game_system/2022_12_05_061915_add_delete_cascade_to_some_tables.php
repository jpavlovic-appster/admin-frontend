<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeleteCascadeToSomeTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('subscriber_system.subscribers', function (Blueprint $table) {
            $table->softDeletes();
            // $table->dropForeign('subscribers_fk_1');
            // $table->foreign(['organization_id'], 'subscribers_fk_1')->references('id')->on('organizations')->onDelete('cascade');
        });

        Schema::table('online_game_system.crash_game_settings', function (Blueprint $table) {
            $table->softDeletes();
        }); 

        Schema::table('subscriber_system.admin_users', function (Blueprint $table) {
            $table->softDeletes();
        }); 

        Schema::table('configurations', function (Blueprint $table) {
            $table->softDeletes();
        });


        Schema::table('subscriber_system.users', function (Blueprint $table) {
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       
    }
}
