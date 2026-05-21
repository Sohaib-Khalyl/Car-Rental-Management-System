<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->bookings()->with('car')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $car = \App\Models\Car::findOrFail($validated['car_id']);
        
        $start = \Carbon\Carbon::parse($validated['start_date']);
        $end = \Carbon\Carbon::parse($validated['end_date']);
        $days = $start->diffInDays($end) + 1; // inclusive of start day
        
        $total_price = $days * $car->price_per_day;

        $booking = $request->user()->bookings()->create([
            'car_id' => $validated['car_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_price' => $total_price,
            'status' => 'pending',
        ]);

        return response()->json($booking, 201);
    }
}
