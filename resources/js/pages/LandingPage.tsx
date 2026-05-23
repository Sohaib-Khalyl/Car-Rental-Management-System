import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Search,
  Users,
  Fuel,
  Gauge,
  Car,
  Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCarImage } from '../lib/carImages';

interface LandingCar {
  id: number;
  name: string;
  brand: string;
  price: number;
  fuelType: string;
  passengers: number;
  transmission: string;
  image: string;
}

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Any');
  const [featuredCars, setFeaturedCars] = useState<LandingCar[]>([]);
  const [totalCars, setTotalCars] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        setTotalCars(data.length);
        const mappedCars = data.map((c: {
          id: number;
          model: string;
          brand: string;
          price_per_day: string;
          fuel_type: string;
          passenger_capacity: number;
          image_path: string | null;
          description?: string;
        }) => ({
          id: c.id,
          name: c.model,
          brand: c.brand,
          price: parseInt(c.price_per_day),
          fuelType: c.fuel_type,
          passengers: c.passenger_capacity,
          transmission: (c.model.toLowerCase().includes('automatic') || c.model.toLowerCase().includes('auto') || (c.description || '').toLowerCase().includes('automatic')) ? 'Automatic' : 'Manual',
          image: c.image_path || getCarImage(c.brand, c.model),
        }));
        setFeaturedCars(mappedCars.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    if (!startDate || !endDate) return;
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
      category: selectedCategory
    });
    navigate(`/wizard?${params.toString()}`);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[72vh] flex items-center pt-16 pb-24">
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
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="w-full lg:w-1/4 bg-white/5 border border-white/5 rounded-xl p-3 flex items-center space-x-3">
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Agency Location</div>
                  <div className="text-white font-medium text-sm">Teima Cars — Oulad Teima</div>
                </div>
              </div>

              <div className="w-full lg:w-1/3 flex gap-2">
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

              <div className="w-full lg:w-1/4 bg-white/5 border border-white/5 rounded-xl p-3 flex items-center space-x-3">
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <Car className="h-5 w-5 text-cyan-500" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Category</div>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-white font-medium text-sm focus:outline-none w-full border-none p-0 cursor-pointer appearance-none text-left [&>option]:bg-zinc-900 [&>option]:text-white"
                  >
                    <option value="Any">Any</option>
                    <option value="Economic">Economic</option>
                    <option value="Compact">Compact</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Automatic">Automatic</option>
                    <option value="7 seter car">7 seter car</option>
                  </select>
                </div>
              </div>

              <button onClick={handleSearch} className="w-full lg:w-auto bg-cyan-500 text-black p-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center space-x-2 font-bold uppercase tracking-widest text-sm flex-1 lg:flex-none">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
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
          {featuredCars.map((car, index) => (
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
                    <span className="text-cyan-500 font-bold text-2xl">{car.price} MAD</span>
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
            { label: 'Premium Vehicles', value: totalCars !== null ? `${totalCars}+` : '…', icon: Car },
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
          <h2 className="text-4xl font-bold tracking-tighter mb-4 italic uppercase">Client Stories</h2>
          <p className="text-gray-500">Premium service for premium people.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Jenkins',
              role: 'Business Traveler',
              initials: 'SJ',
              rating: 5,
              text: 'Teima Cars exceeded all my expectations. Booking was remarkably fast, and picking up the Citroën C3 Automatic at Agadir Airport was perfectly smooth. I highly recommend them for any professional trip!'
            },
            {
              name: 'Yassine El Mansouri',
              role: 'Family Vacation',
              initials: 'YM',
              rating: 5,
              text: 'Renting the Dacia Jogger was a game-changer for our family trip in Agadir. The car was spotless, brand new, and extremely fuel-efficient. Truly professional service with no deposit required!'
            },
            {
              name: 'Elena Rostova',
              role: 'Adventure Enthusiast',
              initials: 'ER',
              rating: 5,
              text: 'Outstanding experience renting the Dacia Duster SUV. We took it up to the Atlas Mountains and it handled beautifully. Extremely helpful support staff and straightforward, transparent terms!'
            }
          ].map((testimonial, i) => (
            <div key={i} className="bg-[#111] p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-24 h-24 fill-cyan-500" />
              </div>
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-cyan-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-400 italic mb-8 relative z-10 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 font-bold text-sm flex items-center justify-center border border-cyan-500/10">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
