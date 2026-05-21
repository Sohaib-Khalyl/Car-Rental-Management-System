import { Car } from './types';

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    name: 'Stealth-7',
    brand: 'Aether',
    type: 'Luxury',
    price: 150,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?auto=format&fit=crop&q=80&w=1000',
    fuelType: 'Electric',
    passengers: 5,
    transmission: 'Automatic',
    rating: 4.9,
    topSpeed: 250,
    acceleration: '3.2s',
    description: 'The pinnacle of electric luxury. Quiet, powerful, and impeccably designed.'
  },
  {
    id: '2',
    name: 'Nomad X',
    brand: 'Terra',
    type: 'SUV',
    price: 120,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000',
    fuelType: 'Hybrid',
    passengers: 7,
    transmission: 'Automatic',
    rating: 4.8,
    topSpeed: 210,
    acceleration: '5.5s',
    description: 'An all-terrain beast that doesn\'t compromise on comfort.'
  },
  {
    id: '3',
    name: 'Velocity GT',
    brand: 'Apex',
    type: 'Sports',
    price: 250,
    image: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&q=80&w=1000',
    fuelType: 'Electric',
    passengers: 2,
    transmission: 'Automatic',
    rating: 5.0,
    topSpeed: 320,
    acceleration: '2.4s',
    description: 'A track-ready machine built for pure adrenaline.'
  },
  {
    id: '4',
    name: 'Core S',
    brand: 'Urban',
    type: 'Sedan',
    price: 80,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000',
    fuelType: 'Gasoline',
    passengers: 5,
    transmission: 'Manual',
    rating: 4.5,
    topSpeed: 200,
    acceleration: '7.1s',
    description: 'Efficient, reliable, and stylish. The perfect companion for city life.'
  },
  {
    id: '5',
    name: 'Eclipse R',
    brand: 'Apex',
    type: 'Sports',
    price: 220,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000',
    fuelType: 'Electric',
    passengers: 2,
    transmission: 'Automatic',
    rating: 4.9,
    topSpeed: 300,
    acceleration: '2.8s',
    description: 'Futuristic design meets unparalleled performance.'
  }
];
