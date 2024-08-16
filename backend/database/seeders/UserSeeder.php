<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;

use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      \App\Models\User::factory(150)->create()->each(function ($user) {
           $user->wallet()->save(\App\Models\Wallets::factory()->make());
        });
    }
}
