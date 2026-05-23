<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\File;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        // Safely disable foreign key checks to truncate all related tables
        Schema::disableForeignKeyConstraints();
        DB::table('bookings')->truncate();
        DB::table('favorites')->truncate();
        DB::table('reviews')->truncate();
        DB::table('pricing_rules')->truncate();
        DB::table('cars')->truncate();
        Schema::enableForeignKeyConstraints();

        // Load scraped car data from JSON
        $jsonPath = database_path('seeders/cars_data.json');
        if (!File::exists($jsonPath)) {
            $this->command->error("Seeder data file not found at: {$jsonPath}");
            return;
        }

        $carsData = json_decode(File::get($jsonPath), true);
        if (empty($carsData)) {
            $this->command->error("No cars data found in: {$jsonPath}");
            return;
        }

        $now = now();
        $carsToInsert = [];

        foreach ($carsData as $car) {
            $carsToInsert[] = [
                'brand' => $car['brand'],
                'model' => $car['model'],
                'year' => $car['year'] ?? 2024,
                'price_per_day' => $car['price_per_day'],
                'fuel_type' => $car['fuel_type'],
                'passenger_capacity' => $car['passenger_capacity'],
                'luggage_capacity' => $car['luggage_capacity'],
                'status' => $car['status'] ?? 'available',
                'image_path' => $car['image_path'] ?? null,
                'description' => $car['description'] ?? null,
                'category' => $car['category'] ?? null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('cars')->insert($carsToInsert);
    }
}
