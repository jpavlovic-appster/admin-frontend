<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        //Subscriber system
        $this->call(SubscriberAdminRolesTableSeeder::class);

        //Public
        $this->call(SuperAdminUsersTableSeeder::class);
        $this->call(SuperRolesTableSeeder::class);
        $this->call(SuperAdminUsersSuperRolesTableSeeder::class);
        $this->call(SuperAdminUserPermissionsTableSeeder::class);
        $this->call(CurrenciesTableSeeder::class);
        $this->call(LanguagesTableSeeder::class);

        //Online Game System
        $this->call(CrashGameGlobalSettingsTableSeeder::class);

    }
}
