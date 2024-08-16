<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CurrenciesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('currencies')->delete();
        
        \DB::table('currencies')->insert(array (
            0 => 
            array (
                'id' => 2,
                'name' => 'Yen',
                'code' => 'YEN',
                'primary' => false,
                'exchange_rate' => 1.47824,
                'created_at' => '2021-03-01 12:22:59.690',
                'updated_at' => '2022-01-27 13:59:40.000',
                'symbol' => '&#165;',
            ),
            1 => 
            array (
                'id' => 4,
                'name' => 'Pound Sterling',
                'code' => 'GBP',
                'primary' => false,
                'exchange_rate' => 0.00987,
                'created_at' => '2021-03-01 12:22:59.690',
                'updated_at' => '2022-01-27 13:59:40.000',
                'symbol' => '&#163;',
            ),
            2 => 
            array (
                'id' => 5,
                'name' => 'Rupee',
                'code' => 'INR',
                'primary' => false,
                'exchange_rate' => 1.00000,
                'created_at' => '2021-03-01 12:22:59.690',
                'updated_at' => '2022-01-27 13:59:40.000',
                'symbol' => '&#8377;',
            ),
            3 => 
            array (
                'id' => 1,
                'name' => 'United Sates Dollar',
                'code' => 'USD',
                'primary' => false,
                'exchange_rate' => 0.01343,
                'created_at' => '2021-03-01 12:22:59.690',
                'updated_at' => '2022-01-27 13:59:40.000',
                'symbol' => '&#36;',
            ),
            4 => 
            array (
                'id' => 3,
                'name' => 'Euro',
                'code' => 'EUR',
                'primary' => true,
                'exchange_rate' => 0.01148,
                'created_at' => '2021-03-01 12:22:59.690',
                'updated_at' => '2022-01-27 13:59:40.000',
                'symbol' => '&#8364;',
            ),
            
        ));
        //
    }
}
