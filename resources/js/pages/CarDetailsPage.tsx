import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Users,
  Fuel,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Zap,
  Info,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { getCarImage } from '../lib/carImages';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface DetailsCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  price_per_day: string;
  fuel_type: string;
  passenger_capacity: number;
  luggage_capacity: number;
  status: string;
  image_path: string | null;
  description: string;
}

export default function CarDetailsPage() {
  const { id } = useParams();
  const { user, token, setShowAuthModal } = useAuth();

  const [car, setCar] = useState<DetailsCar | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedCars, setRelatedCars] = useState<DetailsCar[]>([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    setLoading(true);
    setCar(null);
    setBookingSuccess(false);
    setBookingError('');
    setStartDate('');
    setEndDate('');

    fetch(`/api/cars/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setCar(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/cars')
      .then(res => res.json())
      .then(data =>
        setRelatedCars(
          data.filter((c: DetailsCar) => String(c.id) !== String(id)).slice(0, 3)
        )
      )
      .catch(() => {});
  }, [id]);

  const getTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diff =
      Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return Math.max(0, diff);
  };

  const handleReservation = async () => {
    if (!car) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!startDate || !endDate) {
      setBookingError('Please select both pickup and return dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setBookingError('Return date must be on or after the pickup date.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car_id: car.id,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
      } else {
        const data = await res.json();
        setBookingError(data.message || 'Booking failed. Please try again.');
      }
    } catch {
      setBookingError('Network error. Please check your connection.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500 w-12 h-12" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Car Not Found</h1>
          <Link to="/cars" className="text-cyan-500 font-bold underline">
            Return to Fleet
          </Link>
        </div>
      </div>
    );
  }

  const carImage = car.image_path || getCarImage(car.brand, car.model);
  const totalDays = getTotalDays();
  const totalPrice = totalDays * parseFloat(car.price_per_day);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        to="/cars"
        className="flex items-center space-x-2 text-gray-500 hover:text-white mb-8 group w-fit"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Gallery</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ── Left: Car Info ── */}
        <div className="lg:col-span-12 xl:col-span-8">
          {/* Hero image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-white/10 group">
            <img
              src={carImage}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="text-cyan-500 text-sm font-bold uppercase tracking-[0.3em] mb-2 block">
                {car.brand}
              </span>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white">
                {car.model}
              </h1>
            </div>
            {/* Status badge */}
            <div
              className={cn(
                'absolute top-6 right-6 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-sm',
                car.status === 'available'
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              )}
            >
              {car.status}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Year', value: car.year, icon: Gauge },
              { label: 'Capacity', value: `${car.passenger_capacity} Seats`, icon: Users },
              { label: 'Fuel Type', value: car.fuel_type, icon: Fuel },
              { label: 'Luggage', value: `${car.luggage_capacity} bags`, icon: Zap },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center"
              >
                <stat.icon className="w-6 h-6 text-cyan-500 mb-3" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  {stat.label}
                </span>
                <span className="text-lg font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Description + Specs */}
          <div className="space-y-12">
            <section>
              <h3 className="text-2xl font-bold italic uppercase tracking-tighter mb-6 flex items-center space-x-2">
                <Info className="w-6 h-6 text-cyan-500" />
                <span>The Experience</span>
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                {car.description || `The ${car.brand} ${car.model} is engineered for those who demand more than just a drive — it is a statement of style and performance. Sophisticated design meets cutting-edge ${car.fuel_type?.toLowerCase()} technology. Experience a level of comfort and efficiency that redefines the modern car rental industry.`}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-6 text-gray-300">
                Vehicle Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                {[
                  { k: 'Brand', v: car.brand },
                  { k: 'Model', v: car.model },
                  { k: 'Year', v: car.year },
                  { k: 'Fuel Type', v: car.fuel_type },
                  { k: 'Passenger Capacity', v: `${car.passenger_capacity} persons` },
                  { k: 'Luggage Capacity', v: `${car.luggage_capacity} bags` },
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

        {/* ── Right: Booking Sidebar ── */}
        <div className="lg:col-span-12 xl:col-span-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl">
            {bookingSuccess ? (
              /* ── Success State ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                  <CheckCircle className="w-10 h-10 text-cyan-500" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-400 text-sm mb-1">
                  {car.brand} {car.model} · {totalDays} day{totalDays !== 1 ? 's' : ''}
                </p>
                <p className="text-cyan-500 font-black text-3xl mb-8">
                  {totalPrice.toFixed(0)} MAD
                </p>
                <Link
                  to="/profile"
                  className="block w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all text-center mb-3"
                >
                  View My Bookings
                </Link>
                <button
                  onClick={() => {
                    setBookingSuccess(false);
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="w-full text-gray-500 hover:text-white py-3 text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Make Another Booking
                </button>
              </motion.div>
            ) : (
              /* ── Booking Form ── */
              <>
                {/* Price header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">
                      Rental Pricing
                    </span>
                    <div className="flex items-end space-x-1">
                      <span className="text-4xl font-black text-cyan-500">
                        {parseInt(car.price_per_day)} MAD
                      </span>
                      <span className="text-gray-500 text-sm font-bold uppercase mb-1">/ day</span>
                    </div>
                  </div>
                </div>

                {/* Date pickers */}
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
                      Pickup Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                      <input
                        type="date"
                        value={startDate}
                        min={today}
                        onChange={e => {
                          setStartDate(e.target.value);
                          setBookingError('');
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
                      Return Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" />
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || today}
                        onChange={e => {
                          setEndDate(e.target.value);
                          setBookingError('');
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Price summary */}
                {totalDays > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 mb-6 flex justify-between items-center"
                  >
                    <span className="text-gray-400 text-sm">
                      {totalDays} day{totalDays !== 1 ? 's' : ''} × {parseInt(car.price_per_day)}{' '}
                      MAD
                    </span>
                    <span className="text-white font-black text-xl">
                      {totalPrice.toFixed(0)} MAD
                    </span>
                  </motion.div>
                )}

                {/* Error */}
                {bookingError && (
                  <div className="flex items-start space-x-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-red-400 text-xs font-medium">{bookingError}</span>
                  </div>
                )}

                {/* CTA */}
                <button
                  id="reservation-btn"
                  onClick={handleReservation}
                  disabled={bookingLoading || car.status !== 'available'}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black py-5 rounded-2xl font-black uppercase italic tracking-wider transition-all mb-4 flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing…
                    </>
                  ) : car.status !== 'available' ? (
                    'Currently Unavailable'
                  ) : !user ? (
                    'Sign In to Reserve'
                  ) : (
                    'Instant Reservation'
                  )}
                </button>
                <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">
                  Free cancellation up to 48 h before pickup
                </p>

                {/* Perks */}
                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center space-x-3 text-cyan-500/80">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Premium Insurance Included
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan-500" />
                    <span className="text-xs">Advanced driver assistance package</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan-500" />
                    <span className="text-xs">24/7 Concierge &amp; Roadside assistance</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Related Cars */}
      {relatedCars.length > 0 && (
        <section className="mt-32">
          <h2 className="text-3xl font-bold italic uppercase tracking-tighter mb-12">
            Similar Experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedCars.map(rc => (
              <Link
                key={rc.id}
                to={`/cars/${rc.id}`}
                className="group block bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={rc.image_path || getCarImage(rc.brand, rc.model)}
                    alt={rc.model}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold group-hover:text-cyan-500 transition-colors uppercase italic">
                    {rc.model}
                  </h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                      {rc.brand}
                    </span>
                    <span className="text-cyan-500 font-bold">
                      {parseInt(rc.price_per_day)} MAD/day
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
