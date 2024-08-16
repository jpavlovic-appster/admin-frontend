<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTimestampColumnsToTimestamTz extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       
          
          Schema::table('online_game_system.free_bet_rains', function (Blueprint $table) {
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('created_at')->nullable()->change(); 
          });
          
          Schema::table('online_game_system.crash_game_settings', function (Blueprint $table) {
            $table->dateTimeTz('deleted_at')->nullable()->change(); 
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });
          
          Schema::table('online_game_system.global_settings', function (Blueprint $table) {
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('created_at')->nullable()->change(); 
          });
          
          Schema::table('online_game_system.free_bets', function (Blueprint $table) {
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('end_date')->nullable()->change(); 
            $table->dateTimeTz('created_at')->nullable()->change(); 
          });
          
          Schema::table('online_game_system.crash_game_bets', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });
          
          Schema::table('online_game_system.crash_game_round_details', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });
          
          Schema::table('online_game_system.crash_game_transactions', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });

          Schema::table('public.super_admin_users', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('reset_password_sent_at')->nullable()->change(); 
            $table->dateTimeTz('remember_created_at')->nullable()->change(); 
          });
          
          Schema::table('public.oauth_auth_codes', function (Blueprint $table) {
            $table->dateTimeTz('expires_at')->nullable()->change(); 
          });
          
          Schema::table('public.super_roles', function (Blueprint $table) {
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('created_at')->nullable()->change(); 
          });
          
          Schema::table('public.languages', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });
          
          Schema::table('public.organizations', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('deleted_at')->nullable()->change(); 
          });
          
          Schema::table('public.oauth_access_tokens', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('expires_at')->nullable()->change(); 
          });
          
          Schema::table('public.oauth_refresh_tokens', function (Blueprint $table) {
            $table->dateTimeTz('expires_at')->nullable()->change(); 
          });
          
          Schema::table('public.oauth_clients', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });
          
          Schema::table('public.oauth_personal_access_clients', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });
          
          Schema::table('public.configurations', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('deleted_at')->nullable()->change(); 
          });
          
          Schema::table('public.currencies', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });
          
          Schema::table('public.failed_jobs', function (Blueprint $table) {
            $table->dateTimeTz('failed_at')->nullable()->change(); 
          });
          
          Schema::table('public.super_admin_user_permissions', function (Blueprint $table) {
            $table->dateTimeTz('created_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
          });

          Schema::table('subscriber_system.admin_users', function (Blueprint $table) {
            $table->dateTimeTz('remember_created_at')->nullable()->change(); 
            $table->dateTimeTz('reset_password_sent_at')->nullable()->change(); 
            $table->dateTimeTz('deleted_at')->nullable()->change(); 
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('created_at')->nullable()->change(); 
          });
          
          Schema::table('subscriber_system.admin_roles', function (Blueprint $table) {
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('created_at')->nullable()->change(); 
          });
          
          Schema::table('subscriber_system.subscribers', function (Blueprint $table) {
            $table->dateTimeTz('deleted_at')->nullable()->change(); 
          });
          
          Schema::table('subscriber_system.users', function (Blueprint $table) {
            $table->dateTimeTz('deleted_at')->nullable()->change(); 
          });
          
          Schema::table('subscriber_system.admin_user_permissions', function (Blueprint $table) {
            $table->dateTimeTz('updated_at')->nullable()->change(); 
            $table->dateTimeTz('created_at')->nullable()->change(); 
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
