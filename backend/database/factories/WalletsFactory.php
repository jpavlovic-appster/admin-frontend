<?php
namespace Database\Factories;

use App\Models\User;
use App\Models\Wallets;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class WalletsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Wallets::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
      $currency = array('GBP' , 'YEN' , 'USD' , 'EUR');
      shuffle($currency);
      return [

        'currency_code' => $currency[0],
        'owner_type' => 'User'
    ];
    }
}

