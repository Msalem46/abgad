<?php
namespace Database\Factories;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreFactory extends Factory
{
    protected $model = Store::class;

    public function definition(): array
    {
        return [
            'owner_id' => User::factory(),
            'trading_name' => $this->faker->company,
            'national_id' => $this->faker->numerify('#############'),
            'trading_license_number' => 'TL-' . $this->faker->unique()->numerify('###-####-###'),
            'commercial_registration_number' => 'CR-' . $this->faker->numerify('#########'),
            'tax_number' => 'TAX-' . $this->faker->numerify('#########'),
            'municipality_license' => 'MUN-' . $this->faker->numerify('###-####'),
            'health_permit' => 'HP-' . $this->faker->year . '-' . $this->faker->numerify('###'),
            'fire_safety_certificate' => 'FSC-' . $this->faker->year . '-' . $this->faker->numerify('###'),
            'description' => $this->faker->paragraph,
            'category' => $this->faker->randomElement(['Restaurant', 'Cafe', 'Shop', 'Service']),
            'subcategory' => $this->faker->randomElement(['Fast Food', 'Traditional', 'Modern', 'Specialty']),
            'established_date' => $this->faker->dateTimeBetween('-10 years', 'now')->format('Y-m-d'),
            'website' => $this->faker->optional()->url,
            'social_media' => [
                'facebook' => $this->faker->optional()->url,
                'instagram' => $this->faker->optional()->url,
            ],
            'operating_hours' => [
                'sunday' => ['open' => '09:00', 'close' => '22:00'],
                'monday' => ['open' => '09:00', 'close' => '22:00'],
                'tuesday' => ['open' => '09:00', 'close' => '22:00'],
                'wednesday' => ['open' => '09:00', 'close' => '22:00'],
                'thursday' => ['open' => '09:00', 'close' => '22:00'],
                'friday' => ['open' => '14:00', 'close' => '22:00'],
                'saturday' => ['open' => '09:00', 'close' => '22:00'],
            ],
            'is_active' => true,
            'is_verified' => $this->faker->boolean(70),
            'verification_date' => function (array $attributes) {
                return $attributes['is_verified'] ? $this->faker->dateTimeBetween('-1 year', 'now') : null;
            },
        ];
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
            'verification_date' => now(),
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => false,
            'verification_date' => null,
        ]);
    }
}
