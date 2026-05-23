import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Car as CarIcon, 
  MapPin, 
  Search, 
  Users, 
  Fuel, 
  Gauge, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  ShieldCheck,
  User,
  Phone,
  FileText,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCarImage } from '../lib/carImages';



export default function RecommendationWizard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, setShowAuthModal, token } = useAuth();

  // Initial Step logic: if start and end dates are in URL, go straight to Step 2 (Vehicle Grid)
  const initialStart = searchParams.get('start') || '';
  const initialEnd = searchParams.get('end') || '';
  const initialCategory = searchParams.get('category') || 'Any';

  const [step, setStep] = useState(initialStart && initialEnd ? 2 : 1);
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [category, setCategory] = useState(initialCategory);
  
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [fleet, setFleet] = useState<any[]>([]);
  const [loadingFleet, setLoadingFleet] = useState(false);

  // Form Fields State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [passportId, setPassportId] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Booking states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Update form fields when user auth state changes
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Fetch Fleet
  useEffect(() => {
    setLoadingFleet(true);
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
        setFleet(mapped);
        setLoadingFleet(false);
      })
      .catch(() => setLoadingFleet(false));
  }, []);

  const getTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, diff);
  };

  const totalDays = getTotalDays();
  const today = new Date().toISOString().split('T')[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select both Pickup and Return dates.");
      return;
    }
    // Update query params
    setSearchParams({
      start: startDate,
      end: endDate,
      category: category
    });
    setStep(2);
  };

  const handleSelectCar = (car: any) => {
    setSelectedCar(car);
    setStep(3);
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!startDate || !endDate || !selectedCar) {
      setBookingError('Missing rental parameters.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const payload = {
        car_id: selectedCar.id,
        start_date: startDate,
        end_date: endDate,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setBookingSuccess(true);
      } else {
        const errorData = await response.json();
        setBookingError(errorData.message || 'Reservation failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setBookingError('Network error. Please check your internet connection.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Filter cars matching category and active status
  const filteredCars = fleet.filter(car => {
    const matchesCategory = category === 'Any' || category === 'All' || car.type.toLowerCase().includes(category.toLowerCase());
    const matchesStatus = car.status === 'available';
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-[85vh] flex flex-col justify-center">
      
      {/* ── Progress Tracker ── */}
      {!bookingSuccess && (
        <div className="max-w-md mx-auto w-full mb-12">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
            <span className={cn(step >= 1 ? "text-cyan-500 font-black" : "")}>1. Search Criteria</span>
            <span className={cn(step >= 2 ? "text-cyan-500 font-black" : "")}>2. Select Vehicle</span>
            <span className={cn(step >= 3 ? "text-cyan-500 font-black" : "")}>3. Secure Checkout</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden flex">
            <div className={cn("h-full bg-cyan-500 transition-all duration-500", 
              step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
            )} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {bookingSuccess ? (
          /* ── SUCCESS SCREEN ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto w-full bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative"
          >
            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/30">
              <CheckCircle className="w-10 h-10 text-cyan-500" />
            </div>
            
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Reservation Confirmed!</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Your rental is successfully secured. Our administrative team will reach out to you within the hour to coordinate delivery.
            </p>

            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl mb-8 text-left space-y-4">
              <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                <span className="text-gray-500">Selected Vehicle</span>
                <span className="text-white font-bold">{selectedCar?.brand} {selectedCar?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="text-white font-bold">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                <span className="text-gray-500">Pickup Date</span>
                <span className="text-white font-bold">{startDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                <span className="text-gray-500">Return Date</span>
                <span className="text-white font-bold">{endDate}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-bold">
                <span className="text-gray-400">Total Price</span>
                <span className="text-cyan-500 font-black text-2xl">{(totalDays * selectedCar?.price).toLocaleString()} MAD</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/profile" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all text-center">
                View My Reservations
              </Link>
              <Link to="/" className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all text-center border border-white/10">
                Return to Gallery
              </Link>
            </div>
          </motion.div>

        ) : step === 1 ? (
          /* ── STEP 1: CRITERIA FORM ── */
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto w-full"
          >
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Choose Rental Details</h2>
              <p className="text-gray-500">Select dates and category to find available vehicles.</p>
            </div>

            <form onSubmit={handleSearchSubmit} className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                    <input 
                      type="date"
                      value={startDate}
                      min={today}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm text-white font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                    <input 
                      type="date"
                      value={endDate}
                      min={startDate || today}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm text-white font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Vehicle Category</label>
                <div className="relative">
                  <CarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm text-white font-medium appearance-none cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-white"
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

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-5 rounded-2xl font-black uppercase italic tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Find Available Vehicles</span>
              </button>
            </form>
          </motion.div>

        ) : step === 2 ? (
          /* ── STEP 2: CAR SELECTION GRID ── */
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <button 
                  onClick={() => setStep(1)} 
                  className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modify Criteria</span>
                </button>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter">Choose Your Vehicle</h2>
                <p className="text-gray-500 text-sm mt-1">Showing available vehicles for {startDate} to {endDate} under category "{category}"</p>
              </div>

              <div className="bg-[#111] border border-white/5 px-6 py-3 rounded-2xl text-center flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-widest">Duration</span>
                  <span className="text-white font-bold text-sm">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-widest">Filters</span>
                  <span className="text-cyan-500 font-black text-sm uppercase">{category}</span>
                </div>
              </div>
            </div>

            {loadingFleet ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="h-96 bg-[#111] border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                <CarIcon className="w-16 h-16 text-gray-700 mb-6" />
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">No Vehicles Available</h3>
                <p className="text-gray-500 max-w-sm mb-8">All vehicles in this category are rented out for these dates or match other criteria.</p>
                <button onClick={() => setStep(1)} className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl text-white font-bold uppercase tracking-widest text-xs transition-colors">
                  Adjust Dates or Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCars.map((car) => {
                  const calculatedTotalPrice = totalDays * car.price;
                  return (
                    <motion.div
                      layout
                      key={car.id}
                      className="group bg-[#111] border border-white/5 hover:border-cyan-500/30 rounded-3xl overflow-hidden transition-all flex flex-col justify-between shadow-lg"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-cyan-500 font-bold text-xs uppercase tracking-wider">
                          {car.type}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block">{car.brand}</span>
                              <h3 className="text-2xl font-bold group-hover:text-cyan-500 transition-colors uppercase italic">{car.name}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-white font-bold text-lg">{car.price} MAD</span>
                              <span className="text-[10px] text-gray-500 block uppercase">/ day</span>
                            </div>
                          </div>

                          <div className="flex gap-4 py-3 border-y border-white/5 my-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-600" /> {car.passengers} Seats</span>
                            <span className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5 text-gray-600" /> {car.fuelType}</span>
                            <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-gray-600" /> Auto</span>
                          </div>
                        </div>

                        <div className="space-y-4 pt-2">
                          <div className="flex justify-between items-center bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl text-sm">
                            <span className="text-gray-400">Total Price ({totalDays} days)</span>
                            <span className="text-cyan-500 font-black">{calculatedTotalPrice.toLocaleString()} MAD</span>
                          </div>
                          <button
                            onClick={() => handleSelectCar(car)}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all"
                          >
                            Select Vehicle
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

        ) : (
          /* ── STEP 3: CHECKOUT & CONTACT DETAILS ── */
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Left Column: Reservation Summary Card */}
            <div className="lg:col-span-5">
              <button 
                onClick={() => setStep(2)} 
                className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Choose Different Car</span>
              </button>

              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6">Booking Summary</h2>
              
              <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={selectedCar?.image} alt={selectedCar?.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="text-cyan-500 text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">{selectedCar?.brand}</span>
                    <h3 className="text-3xl font-black uppercase italic tracking-tight text-white">{selectedCar?.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                      <span className="text-gray-500">Pick-up Location</span>
                      <span className="text-white font-bold flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-500" /> Oulad Teima</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                      <span className="text-gray-500">Pickup Date</span>
                      <span className="text-white font-bold">{startDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                      <span className="text-gray-500">Return Date</span>
                      <span className="text-white font-bold">{endDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                      <span className="text-gray-500">Rental Period</span>
                      <span className="text-white font-bold">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-[10px] font-bold uppercase block">Total Price</span>
                      <span className="text-xs text-gray-400">{totalDays} days × {selectedCar?.price} MAD</span>
                    </div>
                    <span className="text-cyan-500 font-black text-3xl">{(totalDays * selectedCar?.price).toLocaleString()} MAD</span>
                  </div>

                  <div className="flex items-center gap-3 text-cyan-500/80 bg-cyan-500/5 p-4 rounded-xl border border-cyan-500/10">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Premium comprehensive insurance included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Form */}
            <div className="lg:col-span-7">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6">Billing & Contact Information</h2>

              <div className="bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl">
                {!user ? (
                  /* ── Banner to require login ── */
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 text-cyan-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold uppercase mb-2">Account Required</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">Please authenticate or register an account to secure your premium car rental reservation.</p>
                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg"
                    >
                      Authenticate Now
                    </button>
                  </div>
                ) : (
                  /* ── Billing Form ── */
                  <form onSubmit={handleConfirmReservation} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                          <input 
                            type="text" 
                            value={fullName}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-gray-400 font-medium focus:outline-none cursor-not-allowed opacity-80"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                          <input 
                            type="email" 
                            value={email}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-gray-400 font-medium focus:outline-none cursor-not-allowed opacity-80"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                          <input 
                            type="tel" 
                            placeholder="e.g. +212 600-000000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Passport / ID Card Number</label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                          <input 
                            type="text" 
                            placeholder="e.g. AB123456"
                            value={passportId}
                            onChange={(e) => setPassportId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Special Requests / Flight Number</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-cyan-500 pointer-events-none" />
                        <textarea 
                          rows={3}
                          placeholder="e.g. Flight AT812, delivering at airport terminal 2..."
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                      </div>
                    </div>

                    {bookingError && (
                      <div className="flex items-start space-x-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-red-400 text-xs font-medium">{bookingError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black py-5 rounded-2xl font-black uppercase italic tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Securing Reservation...</span>
                        </>
                      ) : (
                        <span>Instant Reservation</span>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest mt-4">
                      By submitting, you agree to our comprehensive rental agreement and terms of use.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
