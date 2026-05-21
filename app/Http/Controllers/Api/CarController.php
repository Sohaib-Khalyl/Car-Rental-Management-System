<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'available');
        }

        return response()->json($query->get());
    }

    public function show(Car $car)
    {
        return response()->json($car);
    }
}
