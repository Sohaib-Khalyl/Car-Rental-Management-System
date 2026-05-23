<?php

use App\Models\User;
use App\Models\Car;
use App\Models\Booking;

test('guest can register an account via api', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'user' => ['id', 'name', 'email'],
            'token'
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'name' => 'John Doe',
    ]);
});

test('guest can login via api', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'user' => ['id', 'name', 'email'],
            'token'
        ]);
});

test('user can fetch the fleet of cars', function () {
    $car1 = Car::create([
        'brand' => 'Tesla',
        'model' => 'Model S',
        'year' => 2023,
        'price_per_day' => 1500,
        'passenger_capacity' => 5,
        'luggage_capacity' => 2,
        'fuel_type' => 'Electric',
        'status' => 'available',
    ]);

    $car2 = Car::create([
        'brand' => 'Porsche',
        'model' => '911 Carrera',
        'year' => 2022,
        'price_per_day' => 2500,
        'passenger_capacity' => 4,
        'luggage_capacity' => 1,
        'fuel_type' => 'Petrol',
        'status' => 'available',
    ]);

    $response = $this->getJson('/api/cars');

    $response->assertStatus(200)
        ->assertJsonCount(2)
        ->assertJsonFragment(['brand' => 'Tesla', 'model' => 'Model S'])
        ->assertJsonFragment(['brand' => 'Porsche', 'model' => '911 Carrera']);
});

test('authenticated user can update profile via api', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $response = $this->actingAs($user)
        ->putJson('/api/profile', [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'New Name',
        'email' => 'new@example.com',
    ]);
});

test('authenticated user can book a car via api', function () {
    $user = User::factory()->create();
    $car = Car::create([
        'brand' => 'Audi',
        'model' => 'RS6',
        'year' => 2023,
        'price_per_day' => 1800,
        'passenger_capacity' => 5,
        'luggage_capacity' => 3,
        'fuel_type' => 'Petrol',
        'status' => 'available',
    ]);

    $response = $this->actingAs($user)
        ->postJson('/api/bookings', [
            'car_id' => $car->id,
            'start_date' => now()->addDay()->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'id',
            'car_id',
            'user_id',
            'start_date',
            'end_date',
            'total_price',
            'status',
        ]);

    $this->assertDatabaseHas('bookings', [
        'car_id' => $car->id,
        'user_id' => $user->id,
        'total_price' => 5400, // 3 days x 1800
    ]);
});

test('admin can fetch all bookings via api', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $car = Car::create([
        'brand' => 'Audi', 'model' => 'RS6', 'year' => 2023, 'price_per_day' => 1000,
        'passenger_capacity' => 5, 'luggage_capacity' => 3, 'fuel_type' => 'Petrol', 'status' => 'available',
    ]);

    Booking::create(['user_id' => $user1->id, 'car_id' => $car->id, 'start_date' => '2026-05-25', 'end_date' => '2026-05-27', 'total_price' => 3000, 'status' => 'pending']);
    Booking::create(['user_id' => $user2->id, 'car_id' => $car->id, 'start_date' => '2026-05-28', 'end_date' => '2026-05-30', 'total_price' => 3000, 'status' => 'pending']);

    $response = $this->actingAs($admin)
        ->getJson('/api/bookings');

    $response->assertStatus(200)
        ->assertJsonCount(2);
});

test('non-admin user can only fetch their own bookings via api', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $car = Car::create([
        'brand' => 'Audi', 'model' => 'RS6', 'year' => 2023, 'price_per_day' => 1000,
        'passenger_capacity' => 5, 'luggage_capacity' => 3, 'fuel_type' => 'Petrol', 'status' => 'available',
    ]);

    Booking::create(['user_id' => $user1->id, 'car_id' => $car->id, 'start_date' => '2026-05-25', 'end_date' => '2026-05-27', 'total_price' => 3000, 'status' => 'pending']);
    Booking::create(['user_id' => $user2->id, 'car_id' => $car->id, 'start_date' => '2026-05-28', 'end_date' => '2026-05-30', 'total_price' => 3000, 'status' => 'pending']);

    $response = $this->actingAs($user1)
        ->getJson('/api/bookings');

    $response->assertStatus(200)
        ->assertJsonCount(1)
        ->assertJsonFragment(['user_id' => $user1->id])
        ->assertJsonMissing(['user_id' => $user2->id]);
});

test('admin can approve or reject booking status via api', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $car = Car::create([
        'brand' => 'Audi', 'model' => 'RS6', 'year' => 2023, 'price_per_day' => 1000,
        'passenger_capacity' => 5, 'luggage_capacity' => 3, 'fuel_type' => 'Petrol', 'status' => 'available',
    ]);

    $booking = Booking::create(['user_id' => $user->id, 'car_id' => $car->id, 'start_date' => '2026-05-25', 'end_date' => '2026-05-27', 'total_price' => 3000, 'status' => 'pending']);

    // Approve booking
    $response = $this->actingAs($admin)
        ->putJson("/api/bookings/{$booking->id}/status", ['status' => 'approved']);

    $response->assertStatus(200)
        ->assertJsonFragment(['status' => 'approved']);

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'status' => 'approved',
    ]);

    // Reject booking
    $response = $this->actingAs($admin)
        ->putJson("/api/bookings/{$booking->id}/status", ['status' => 'rejected']);

    $response->assertStatus(200)
        ->assertJsonFragment(['status' => 'rejected']);

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'status' => 'rejected',
    ]);
});

test('non-admin user cannot update booking status via api', function () {
    $user = User::factory()->create();
    $car = Car::create([
        'brand' => 'Audi', 'model' => 'RS6', 'year' => 2023, 'price_per_day' => 1000,
        'passenger_capacity' => 5, 'luggage_capacity' => 3, 'fuel_type' => 'Petrol', 'status' => 'available',
    ]);

    $booking = Booking::create(['user_id' => $user->id, 'car_id' => $car->id, 'start_date' => '2026-05-25', 'end_date' => '2026-05-27', 'total_price' => 3000, 'status' => 'pending']);

    $response = $this->actingAs($user)
        ->putJson("/api/bookings/{$booking->id}/status", ['status' => 'approved']);

    $response->assertStatus(403);

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'status' => 'pending', // remains pending
    ]);
});

