import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Users, 
  Fuel, 
  Gauge, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar,
  Star,
  Zap,
  Info
} from 'lucide-react';
import { MOCK_CARS } from '../mockData';
import { cn } from '../lib/utils';

export default function CarDetailsPage() {
  const { id } = useParams();
  const car = MOCK_CARS.find(c => c.id === id);

  if (!car) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Car Not Found</h1>
          <Link to="/cars" className="text-cyan-500 font-bold underline">Return to Fleet</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/cars" className="flex items-center space-x-2 text-gray-500 hover:text-white mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Gallery</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Content */}
        <div className="lg:col-span-12 xl:col-span-8">
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-white/10 group">
            <img 
              src={car.image} 
              alt={car.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="text-cyan-500 text-sm font-bold uppercase tracking-[0.3em] mb-2 block">{car.brand}</span>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white">{car.name}</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Top Speed', value: `${car.topSpeed} km/h`, icon: Gauge },
              { label: '0-100 km/h', value: car.acceleration, icon: Zap },
              { label: 'Capacity', value: `${car.passengers} Seats`, icon: Users },
              { label: 'Fuel Type', value: car.fuelType, icon: Fuel }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center">
                <stat.icon className="w-6 h-6 text-cyan-500 mb-3" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</span>
                <span className="text-lg font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-12">
            <section>
              <h3 className="text-2xl font-bold italic uppercase tracking-tighter mb-6 flex items-center space-x-2">
                <Info className="w-6 h-6 text-cyan-500" />
                <span>The Experience</span>
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                {car.description} Sophisticated design meets cutting edge technology in this {car.type.toLowerCase()} flagship.
                Engineered for those who demand more than just a drive; it's a statement of style and performance. 
                Experience a level of comfort and efficiency that redefines the modern car rental industry.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-6 text-gray-300">Vehicle Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  { k: 'Engine', v: car.fuelType === 'Electric' ? 'Dual Electric Motor' : 'Performance V6' },
                  { k: 'Transmission', v: car.transmission },
                  { k: 'Wheel Drive', v: 'AWD (All-Wheel Drive)' },
                  { k: 'Weight', v: '1,850 kg' },
                  { k: 'Power Output', v: '560 hp' },
                  { k: 'Torque', v: '780 Nm' }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between py-4 border-b border-white/5">
                    <span className="text-gray-500 font-medium">{spec.k}</span>
                    <span className="text-white font-bold">{spec.v}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right: Booking Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 translate-y-0 xl:-translate-y-20">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">Rental Pricing</span>
                <div className="flex items-end space-x-1">
                  <span className="text-4xl font-black text-cyan-500">${car.price}</span>
                  <span className="text-gray-500 text-sm font-bold uppercase mb-1">/ day</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-bold">{car.rating}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                  <input type="text" placeholder="Pickup & Dropoff" className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm font-medium" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Departure</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                    <input type="text" placeholder="May 14" className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Return</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                    <input type="text" placeholder="May 20" className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm font-medium" />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-5 rounded-2xl font-black uppercase italic italic italic tracking-wider transition-all mb-4">
              Instant Reservation
            </button>
            <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">Free cancellation up to 48h before pickup</p>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center space-x-3 text-cyan-500/80">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Premium Insurance Included</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan-500" />
                <span className="text-xs">Advanced driver assistance package</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan-500" />
                <span className="text-xs">24/7 Concierge & Roadside assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <section className="mt-32">
        <h2 className="text-3xl font-bold italic uppercase tracking-tighter mb-12">Similiar Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_CARS.filter(c => c.id !== id).slice(0, 3).map((car) => (
            <Link key={car.id} to={`/cars/${car.id}`} className="group block bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold group-hover:text-cyan-500 transition-colors uppercase italic italic italic">{car.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{car.brand}</span>
                  <span className="text-cyan-500 font-bold">${car.price}/day</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
