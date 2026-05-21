<?php

namespace App\Services;

use App\Models\Car;
use App\Models\User;

class RecommendationEngine
{
    /**
     * Calculate score for a car based on user preferences.
     * 
     * @param Car $car
     * @param array $preferences
     * @return float
     */
    public function calculateScore(Car $car, array $preferences): float
    {
        $score = 0.0;
        
        // Base logic for calculation
        // e.g., if ($car->fuel_type === $preferences['fuel_type']) { $score += 10; }
        // e.g., if ($car->passenger_capacity >= $preferences['passengers']) { $score += 5; }
        
        return $score;
    }

    /**
     * Recommend cars for a user based on preferences.
     * 
     * @param User $user
     * @param array $preferences
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function recommendCars(User $user, array $preferences, int $limit = 5)
    {
        $cars = Car::where('status', 'available')->get();
        
        // Map cars with scores
        $scoredCars = $cars->map(function ($car) use ($preferences) {
            $car->recommendation_score = $this->calculateScore($car, $preferences);
            return $car;
        });

        // Sort by score descending and return
        return $scoredCars->sortByDesc('recommendation_score')->take($limit)->values();
    }
}
