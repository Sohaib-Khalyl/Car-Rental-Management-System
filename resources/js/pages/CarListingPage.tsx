import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Filter,
  Search,
  Grid,
  List,
  Star,
  ChevronDown,
  Users,
  Fuel,
  Gauge,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { getCarImage } from '../lib/carImages';



export default function CarListingPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Any');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const carTypes = ['Any', 'Economic', 'Compact', 'Sedan', 'SUV', 'Automatic', '7 seter car'];

  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((c: any) => ({
          id: c.id,
          name: c.model,
          brand: c.brand,
          type: c.category || 'Economic',
          price: parseInt(c.price_per_day),
          fuelType: c.fuel_type,
          passengers: c.passenger_capacity,
          transmission: (c.model.toLowerCase().includes('automatic') || c.model.toLowerCase().includes('auto') || (c.description || '').toLowerCase().includes('automatic')) ? 'Automatic' : 'Manual',
          rating: 4.9,
          status: c.status,
          image: c.image_path || getCarImage(c.brand, c.model),
        }));
        setCars(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'Any' || selectedType === 'All' || car.type.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 italic uppercase">
            Explore The Fleet
          </h1>
          <p className="text-gray-500">Pick the perfect vehicle for your next journey.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by model or brand…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* View toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'grid' ? 'bg-cyan-500 text-black' : 'text-gray-400'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'list' ? 'bg-cyan-500 text-black' : 'text-gray-400'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside
          className={cn(
            'w-64 space-y-8 h-fit sticky top-32 flex-shrink-0',
            isFilterOpen ? 'block' : 'hidden lg:block'
          )}
        >
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-cyan-500">
              Vehicle Categories
            </h3>
            <div className="space-y-2">
              {carTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group',
                    selectedType === type
                      ? 'bg-cyan-500 text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  )}
                >
                  <span>{type}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      selectedType === type ? '-rotate-90' : ''
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Car Grid / List */}
        <div className="flex-1">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div
              className={cn(
                'grid gap-8',
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
              )}
            >
              <AnimatePresence mode="popLayout">
                {filteredCars.map(car => (
                  <motion.div
                    layout
                    key={car.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      'group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all',
                      viewMode === 'list' && 'flex flex-col md:flex-row'
                    )}
                  >
                    {/* Image */}
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        viewMode === 'grid'
                          ? 'aspect-[16/10]'
                          : 'aspect-[16/10] md:w-80 md:aspect-auto flex-shrink-0'
                      )}
                    >
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-[10px] font-bold text-white">{car.rating}</span>
                      </div>
                      {/* Status badge */}
                      {car.status !== 'available' && (
                        <div className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          {car.status}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block">
                              {car.brand}
                            </span>
                            <h3 className="text-2xl font-bold group-hover:text-cyan-500 transition-colors">
                              {car.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <span className="text-cyan-500 font-bold text-xl">{car.price} MAD</span>
                            <span className="text-gray-500 text-[10px] block uppercase">/ day</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 py-4 border-y border-white/5 my-4">
                          <div className="flex items-center space-x-2">
                            <Users className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {car.passengers} seats
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Fuel className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {car.fuelType}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Gauge className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {car.transmission}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Link
                          to={`/cars/${car.id}`}
                          className="flex-1 bg-white/5 hover:bg-cyan-500 hover:text-black py-3 rounded-xl text-center font-bold text-[10px] uppercase tracking-widest transition-all"
                        >
                          View Details
                        </Link>
                        {/* "Rent Now" navigates to the car detail page so user can pick dates */}
                        <button
                          onClick={() => navigate(`/cars/${car.id}`)}
                          className={cn(
                            'bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all',
                            car.status === 'available'
                              ? 'hover:bg-cyan-400 cursor-pointer'
                              : 'opacity-50 cursor-not-allowed'
                          )}
                          disabled={car.status !== 'available'}
                        >
                          Rent Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
