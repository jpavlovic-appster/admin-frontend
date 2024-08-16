<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_name' => $this->faker->userName(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone'=>$this->faker->phoneNumber(),
            'phone_verified'=>false,
            'email_verified'=>true,
            'parent_type'=>'AdminUser',
            'parent_id'=>1,
            'tenant_id'=>1,
            'date_of_birth'=>"1995-02-15",
            'country_code'=>$this->faker->countryCode(),
            'vip_level'=>0,
            'active'=>true,
            'is_retail_user'=>false,
            'encrypted_password' => md5('12345678'), // password
            'tenant_id' => 1,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
