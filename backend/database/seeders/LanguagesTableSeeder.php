<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LanguagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('languages')->delete();
        
        \DB::table('languages')->insert(array (
            0 => 
            array (
                'id' => 1,
                'code' => 'en',
                'name' => 'English',
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString()
            ),
            1 => 
            array (
                'id' => 2,
                'code' => 'de',
                'name' => 'German',
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString()
            ),
            2 => 
            array (
                'id' => 3,
                'code' => 'es',
                'name' => 'Spanish',
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString()
            ),
            3 => 
            array (
                'id' => 4,
                'code' => 'fr',
                'name' => 'French',
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString()
            ),
            4 => 
            array (
                'id' => 5,
                'code' => 'pt',
                'name' => 'Portuguese',
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString()
            ),
            5 => 
            array (
                'id' => 6,
                'code' => 'ru',
                'name' => 'Russian',
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString()
            ),
            6 => 
            array (
                'id' => 7,
                'code' => 'tr',
                'name' => 'Turkish',
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString()
            )
        ));
        //
    }
}
