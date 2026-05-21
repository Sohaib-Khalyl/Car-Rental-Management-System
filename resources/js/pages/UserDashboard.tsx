import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  Clock, 
  MapPin, 
  CreditCard, 
  Settings, 
  User as UserIcon, 
  Heart,
  History,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_CARS } from '../mockData';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');

  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: History },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'billing', label: 'Billing History', icon: CreditCard },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-[#111] border-r border-white/5 flex flex-col p-4">
        <div className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center p-4 rounded-xl transition-all group",
                activeTab === tab.id ? "bg-cyan-500 text-black" : "text-gray-500 hover:text-white"
              )}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <span className="ml-4 font-bold text-xs uppercase tracking-widest hidden lg:block">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="pt-4 border-t border-white/5 space-y-2">
          <button className="w-full flex items-center p-4 rounded-xl text-gray-500 hover:text-white transition-all">
            <HelpCircle className="w-5 h-5" />
            <span className="ml-4 font-bold text-xs uppercase tracking-widest hidden lg:block">Support</span>
          </button>
          <button className="w-full flex items-center p-4 rounded-xl text-red-500/50 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="ml-4 font-bold text-xs uppercase tracking-widest hidden lg:block">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic italic tracking-tighter mb-2">Member Dashboard</h1>
            <p className="text-gray-500">Welcome back, James. Manage your premium fleet rentals.</p>
          </div>
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-cyan-500" />
            <div>
              <div className="font-bold text-white uppercase italic">James Wilson</div>
              <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Premium Elite Member</div>
            </div>
          </div>
        </header>

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 text-gray-300">Active & Past Bookings</h2>
            {[
              { id: 'BK-9901', car: MOCK_CARS[0], date: 'May 14 - May 20, 2026', status: 'Upcoming', total: 900 },
              { id: 'BK-8752', car: MOCK_CARS[2], date: 'April 02 - April 05, 2026', status: 'Completed', total: 750 },
              { id: 'BK-5411', car: MOCK_CARS[3], date: 'March 15 - March 18, 2026', status: 'Completed', total: 240 },
            ].map((booking) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={booking.id} 
                className="bg-[#111] border border-white/5 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center gap-8 hover:border-white/10 transition-all"
              >
                <div className="w-full lg:w-48 aspect-[16/10] bg-gray-800 rounded-2xl overflow-hidden shrink-0">
                  <img src={booking.car.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">{booking.id}</div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">{booking.car.name}</h3>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      booking.status === 'Upcoming' ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20" : "bg-white/5 text-gray-500 border border-white/10"
                    )}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-400">{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-400">San Francisco Int.</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-bold text-white">${booking.total} Total</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">
                    View Receipt
                  </button>
                  <button className="bg-white/5 hover:bg-cyan-500 hover:text-black text-gray-400 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">
                    Rebook Model
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_CARS.slice(0, 3).map((car) => (
              <div key={car.id} className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden group">
                <div className="relative aspect-video">
                  <img src={car.image} className="w-full h-full object-cover" />
                  <button className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full">
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold uppercase italic italic shrink">{car.name}</h4>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-cyan-500 font-bold">${car.price}/day</span>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-8 text-gray-300">Identity Information</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                  <input type="text" defaultValue="James Wilson" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
                  <input type="text" defaultValue="james.w@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Billing Currency</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>SAR (﷼)</option>
                </select>
              </div>
              <button className="bg-cyan-500 text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-cyan-400 transition-all">
                Save Profile Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
