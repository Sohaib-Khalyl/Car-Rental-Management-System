<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RecommendationEngine;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    protected $engine;

    public function __construct(RecommendationEngine $engine)
    {
        $this->engine = $engine;
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'budget' => 'required|string',
            'trip' => 'required|string',
            'passengers' => 'required|integer',
            'luggage' => 'required|string',
            'fuel' => 'required|string',
        ]);

        // Normally we'd use auth()->user(), but for UI demo we might be guest
        $user = auth('sanctum')->user() ?? new \App\Models\User();

        $recommendations = $this->engine->recommendCars($user, $validated, 3);

        return response()->json($recommendations);
    }
}
