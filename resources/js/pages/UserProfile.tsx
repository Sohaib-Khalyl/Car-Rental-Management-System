import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  MapPin,
  CreditCard,
  Settings,
  History,
  HelpCircle,
  LogOut,
  Calendar,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { getCarImage } from '../lib/carImages';
import { useAuth } from '../contexts/AuthContext';

// ── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'approved':
    case 'completed':
    case 'active':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-white/5 text-gray-400 border-white/10';
  }
}

function mapBooking(b: any) {
  return {
    id: b.id,
    status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
    total: b.total_price,
    startDate: b.start_date ? b.start_date.split('T')[0] : '',
    endDate: b.end_date ? b.end_date.split('T')[0] : '',
    car: {
      id: b.car?.id,
      name: b.car ? `${b.car.brand} ${b.car.model}` : 'Unknown Car',
      brand: b.car?.brand ?? '',
      model: b.car?.model ?? '',
      price: b.car ? parseInt(b.car.price_per_day) : 0,
      fuelType: b.car?.fuel_type || 'Diesel',
      imagePath: b.car?.image_path ?? null,
    },
  };
}

// ── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: any }) {
  const [expanded, setExpanded] = useState(false);
  const carImg = booking.car.imagePath || getCarImage(booking.car.brand, booking.car.model);

  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const days =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all"
    >
      {/* Main row */}
      <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Car image */}
        <div className="w-full lg:w-44 aspect-[16/10] bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0">
          <img
            src={carImg}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            alt={booking.car.name}
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">
                RESERVATION #{booking.id}
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                {booking.car.name}
              </h3>
            </div>
            <span
              className={cn(
                'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border',
                statusColor(booking.status)
              )}
            >
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span>
                {booking.startDate} → {booking.endDate}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span>{days} day{days !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-sm font-bold text-white">{booking.total} MAD</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            Receipt {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <Link
            to={`/cars/${booking.car.id}`}
            className="bg-white/5 hover:bg-cyan-500 hover:text-black text-gray-400 text-center px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            Rebook
          </Link>
        </div>
      </div>

      {/* Expanded receipt */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-6 bg-white/[0.02]">
              <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-4">
                Booking Receipt
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 max-w-lg">
                {[
                  { k: 'Booking ID', v: `#${booking.id}` },
                  { k: 'Vehicle', v: booking.car.name },
                  { k: 'Pickup Date', v: booking.startDate },
                  { k: 'Return Date', v: booking.endDate },
                  { k: 'Duration', v: `${days} day${days !== 1 ? 's' : ''}` },
                  { k: 'Daily Rate', v: `${booking.car.price} MAD` },
                  { k: 'Total Charged', v: `${booking.total} MAD` },
                  { k: 'Status', v: booking.status },
                ].map(row => (
                  <div key={row.k} className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-gray-500 text-sm">{row.k}</span>
                    <span className="text-white text-sm font-bold">{row.v}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-4">
                <MapPin className="inline w-3 h-3 mr-1" />
                Pickup / Drop-off: Teima Cars HQ, Oulad Teima
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UserProfile() {
  const { user, token, logout, setShowAuthModal, login } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('all');

  // Profile settings
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Fetch bookings once
  useEffect(() => {
    if (!user || !token) {
      setLoadingBookings(false);
      return;
    }
    fetch('/api/bookings', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(data => {
        setBookings(data.map(mapBooking));
        setLoadingBookings(false);
      })
      .catch(() => setLoadingBookings(false));
  }, [user, token]);

  // Seed profile form fields from user
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  // ── Unauthenticated gate ────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 text-cyan-500">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-3">
            Access Profile
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Log in or create a Teima Cars account to view your bookings, manage settings, and
            unlock elite member perks.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all"
          >
            Log In / Register
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Derived data ────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: History },
    { id: 'billing', label: 'Billing History', icon: CreditCard },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status.toLowerCase() === bookingFilter;
  });

  const completedBookings = bookings.filter(
    b => b.status.toLowerCase() === 'completed'
  );
  const totalSpent = completedBookings.reduce((acc, b) => acc + Number(b.total), 0);

  // ── Profile save handler ────────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update the auth context with the new user object
        login(data, token!);
        setProfileMsg({ type: 'ok', text: 'Profile updated successfully.' });
      } else {
        setProfileMsg({ type: 'err', text: data.message || 'Update failed.' });
      }
    } catch {
      setProfileMsg({ type: 'err', text: 'Network error. Please try again.' });
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-[#111] border-r border-white/5 flex flex-col p-4">
        {/* User avatar */}
        <div className="hidden lg:flex items-center space-x-3 p-4 mb-6 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-10 h-10 bg-gray-800 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-500 font-bold uppercase text-sm flex-shrink-0">
            {user.name.substring(0, 2)}
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-white text-sm truncate">{user.name}</div>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center p-4 rounded-xl transition-all',
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              )}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <span className="ml-4 font-bold text-xs uppercase tracking-widest hidden lg:block">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/5 space-y-2">
          <a
            href="mailto:support@teimacars.ma"
            className="w-full flex items-center p-4 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="ml-4 font-bold text-xs uppercase tracking-widest hidden lg:block">
              Support
            </span>
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center p-4 rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-4 font-bold text-xs uppercase tracking-widest hidden lg:block">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-1">
              Member Profile
            </h1>
            <p className="text-gray-500">
              Welcome back, {user.name.split(' ')[0]}. Manage your premium fleet rentals.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex flex-col items-center px-4 border-r border-white/10">
              <span className="text-2xl font-black text-cyan-500">{bookings.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Bookings</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-2xl font-black text-white">{totalSpent.toFixed(0)}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase">MAD Spent</span>
            </div>
          </div>
        </header>

        {/* ── My Bookings Tab ── */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-xl font-bold uppercase tracking-widest text-gray-300">
                Rental History
              </h2>
              {/* Status filter chips */}
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'active', 'completed', 'cancelled'].map(f => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={cn(
                      'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border',
                      bookingFilter === f
                        ? 'bg-cyan-500 text-black border-cyan-500'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loadingBookings ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-[#111] border border-white/5 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-2">
                  {bookingFilter === 'all' ? 'No Bookings Yet' : `No ${bookingFilter} bookings`}
                </h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  {bookingFilter === 'all'
                    ? "You don't have any reservations yet. Check out our high-performance fleet!"
                    : 'No bookings match this filter.'}
                </p>
                {bookingFilter === 'all' && (
                  <Link
                    to="/cars"
                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all"
                  >
                    Browse Cars
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Billing History Tab ── */}
        {activeTab === 'billing' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold uppercase tracking-widest text-gray-300">
                Billing Summary
              </h2>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                {
                  label: 'Total Bookings',
                  value: bookings.length,
                  sub: 'All time',
                },
                {
                  label: 'Completed',
                  value: completedBookings.length,
                  sub: 'Trips taken',
                },
                {
                  label: 'Total Spent',
                  value: `${totalSpent.toFixed(0)} MAD`,
                  sub: 'On completed rentals',
                },
              ].map(card => (
                <div
                  key={card.label}
                  className="bg-[#111] border border-white/5 rounded-2xl p-6"
                >
                  <div className="text-3xl font-black text-cyan-500 mb-1">{card.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white mb-1">
                    {card.label}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Transactions table */}
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Transaction Log
            </h3>
            {loadingBookings ? (
              <div className="h-32 flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-500 w-6 h-6" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions yet.</p>
            ) : (
              <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Vehicle
                      </th>
                      <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">
                        Period
                      </th>
                      <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Status
                      </th>
                      <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{b.car.name}</td>
                        <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                          {b.startDate} → {b.endDate}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              'px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border',
                              statusColor(b.status)
                            )}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-white">
                          {b.total} MAD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Profile Settings Tab ── */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 text-gray-300">
              Identity Information
            </h2>
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={e => setProfileEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>



                {/* Feedback message */}
                {profileMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex items-center space-x-2 rounded-xl p-4 border',
                      profileMsg.type === 'ok'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    )}
                  >
                    {profileMsg.type === 'ok' ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium">{profileMsg.text}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-cyan-500 text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-cyan-400 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    'Save Profile Changes'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
