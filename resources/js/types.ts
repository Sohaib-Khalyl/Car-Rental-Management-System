export interface Car {
  id: string;
  name: string;
  brand: string;
  type: string; // Sedan, SUV, Luxury, Sports
  price: number;
  image: string;
  fuelType: 'Electric' | 'Hybrid' | 'Gasoline';
  passengers: number;
  transmission: 'Automatic' | 'Manual';
  rating: number;
  description: string;
  topSpeed: number;
  acceleration: string;
  range?: number;
  isFavorite?: boolean;
}

export interface Booking {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  totalPrice: number;
}
