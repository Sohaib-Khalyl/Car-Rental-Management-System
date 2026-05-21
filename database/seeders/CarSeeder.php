<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cars')->insert([
            [
                'brand' => 'Tesla',
                'model' => 'Model S Plaid',
                'year' => 2024,
                'price_per_day' => 199.99,
                'fuel_type' => 'Electric',
                'passenger_capacity' => 5,
                'luggage_capacity' => 2,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'brand' => 'Porsche',
                'model' => '911 GT3',
                'year' => 2023,
                'price_per_day' => 450.00,
                'fuel_type' => 'Gasoline',
                'passenger_capacity' => 2,
                'luggage_capacity' => 1,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'brand' => 'Mercedes-Benz',
                'model' => 'S-Class',
                'year' => 2024,
                'price_per_day' => 350.00,
                'fuel_type' => 'Hybrid',
                'passenger_capacity' => 5,
                'luggage_capacity' => 3,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'brand' => 'BMW',
                'model' => 'X7',
                'year' => 2024,
                'price_per_day' => 280.00,
                'fuel_type' => 'Gasoline',
                'passenger_capacity' => 7,
                'luggage_capacity' => 4,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
