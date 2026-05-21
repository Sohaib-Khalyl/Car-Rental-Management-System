import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Calendar,
  Search,
  Star,
  Users,
  Fuel,
  Gauge,
  Car
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_CARS } from '../mockData';
import { cn } from '../lib/utils';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDelivery, setIsDelivery] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleSearch = () => {
    if (!startDate || !endDate) return;
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
      delivery: isDelivery.toString(),
      address: deliveryAddress
    });
    navigate(`/wizard?${params.toString()}`);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center pb-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero Car"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="flex items-center space-x-2 mb-6">
              <span className="h-px w-8 bg-cyan-500" />
              <span className="text-cyan-500 font-bold uppercase tracking-[0.3em] text-xs">Premium Automotive Mobility</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic italic">
              {t('hero.title')}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
              {t('hero.subtitle')}
            </p>
            

          </motion.div>
        </div>

        {/* Quick Search Bar */}
        <div className="absolute bottom-0 translate-y-1/2 left-4 right-4 max-w-5xl mx-auto z-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full bg-white/5 border border-white/5 rounded-xl p-3 flex items-center space-x-3">
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Agency Location</div>
                  <div className="text-white font-medium text-sm">Teima Cars — Oulad Teima</div>
                </div>
              </div>

              <div className="flex-1 flex gap-2">
                <div className="w-1/2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-cyan-500" />
                  </div>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full pl-9 pr-3 py-4 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  />
                </div>
                <div className="w-1/2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-cyan-500" />
                  </div>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full pl-9 pr-3 py-4 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  />
                </div>
              </div>

              <button onClick={handleSearch} className="w-full md:w-auto bg-cyan-500 text-black p-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center space-x-2 font-bold uppercase tracking-widest text-sm">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-white/5">
              <label className="flex items-center space-x-3 cursor-pointer group mb-4 md:mb-0">
                <div className="w-5 h-5 rounded-md border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-cyan-500 transition-colors">
                  <div className={cn("w-3 h-3 rounded-sm bg-cyan-500 transition-opacity", isDelivery ? "opacity-100" : "opacity-0")} />
                </div>
                <input type="checkbox" className="hidden" checked={isDelivery} onChange={(e) => setIsDelivery(e.target.checked)} />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Deliver the car to my location (Delivery fee applies)</span>
              </label>

              {isDelivery && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 max-w-md w-full relative"
                >
                  <input 
                    type="text" 
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address..." 
                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter mb-4 italic uppercase">World-Class Fleet</h2>
            <p className="text-gray-500 max-w-md">Our collection features only the finest examples of modern automotive engineering.</p>
          </div>
          <Link to="/cars" className="text-cyan-500 font-bold flex items-center space-x-2 hover:space-x-4 transition-all">
            <span>View All Models</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_CARS.slice(0, 3).map((car, index) => (
            <motion.div 
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-none block mb-1">{car.brand}</span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-500 transition-colors">{car.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-500 font-bold text-2xl">${car.price}</span>
                    <span className="text-gray-500 text-xs block uppercase">/ day</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5 mb-6">
                  <div className="flex flex-col items-center">
                    <Users className="w-4 h-4 text-gray-500 mb-1" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">{car.passengers} seat</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Fuel className="w-4 h-4 text-gray-500 mb-1" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">{car.fuelType}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Gauge className="w-4 h-4 text-gray-500 mb-1" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">{car.transmission}</span>
                  </div>
                </div>

                <Link to={`/cars/${car.id}`} className="w-full bg-white/5 hover:bg-cyan-500 hover:text-black py-4 rounded-xl text-center font-bold text-xs uppercase tracking-widest transition-all block">
                  Reserve Experience
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/5 py-24 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Premium Vehicles', value: '50+', icon: Car },
            { label: 'Local Branch', value: 'Oulad Teima', icon: MapPin },
            { label: 'Happy Clients', value: '2k+', icon: Users },
            { label: 'Safety Rating', value: '4.9/5', icon: ShieldCheck },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
              <div className="text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tighter mb-4 italic uppercase italic italic">Client Stories</h2>
          <p className="text-gray-500">Premium service for premium people.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map((_, i) => (
            <div key={i} className="bg-[#111] p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-24 h-24 fill-cyan-500" />
              </div>
              <div className="flex mb-4">
                {[1,2,3,4,5].map(j => <Star key={j} className="w-4 h-4 text-cyan-500 fill-current" />)}
              </div>
              <p className="text-gray-400 italic mb-8 relative z-10">
                "The experience was seamless. From the AI-powered recommendations to the premium vehicle pickup, Teima Cars is in a class of its own."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full" />
                <div>
                  <h4 className="font-bold text-white">James Wilson</h4>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Premium Member</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
