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
            $query->where(function($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            if ($request->status !== 'all') {
                $query->where('status', $request->status);
            }
        } else {
            $query->where('status', 'available');
        }

        return response()->json($query->get());
    }

    public function show(Car $car)
    {
        return response()->json($car);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin role required.'], 403);
        }

        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'price_per_day' => 'required|numeric|min:0',
            'fuel_type' => 'required|string|max:255',
            'passenger_capacity' => 'required|integer|min:1',
            'luggage_capacity' => 'required|string|max:255',
            'status' => 'nullable|string|in:available,rented,maintenance',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $dir = public_path('images/cars');
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }
            $file->move($dir, $filename);
            $validated['image_path'] = '/images/cars/' . $filename;
        }

        $car = Car::create(array_merge($validated, [
            'status' => $validated['status'] ?? 'available'
        ]));

        return response()->json($car, 201);
    }

    public function update(Request $request, Car $car)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin role required.'], 403);
        }

        $validated = $request->validate([
            'brand' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'price_per_day' => 'sometimes|required|numeric|min:0',
            'fuel_type' => 'sometimes|required|string|max:255',
            'passenger_capacity' => 'sometimes|required|integer|min:1',
            'luggage_capacity' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string|in:available,rented,maintenance',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            // Delete old file
            if ($car->image_path) {
                $oldPath = public_path(ltrim($car->image_path, '/'));
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $dir = public_path('images/cars');
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }
            $file->move($dir, $filename);
            $validated['image_path'] = '/images/cars/' . $filename;
        }

        $car->update($validated);

        return response()->json($car);
    }

    public function destroy(Request $request, Car $car)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin role required.'], 403);
        }

        $car->delete();

        return response()->json(['message' => 'Car deleted successfully.']);
    }
}
