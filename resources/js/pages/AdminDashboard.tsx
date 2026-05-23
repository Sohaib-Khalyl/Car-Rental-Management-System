import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Car, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  Filter,
  Plus,
  Calendar,
  Activity,
  Edit2,
  Trash2,
  Loader2,
  X,
  Check
} from 'lucide-react';

interface DashboardCar {
  id: number;
  brand: string;
  model: string;
  name: string;
  year: number;
  price_per_day: string | number;
  price: number;
  fuel_type: string;
  fuelType?: string;
  passenger_capacity: number;
  passengers?: number;
  luggage_capacity: string | number;
  status: string;
  category: string;
  type?: string;
  image_path: string | null;
  image: string;
}

interface DashboardBooking {
  id: number;
  user_id: number;
  total_price: string | number;
  status: string;
  created_at: string;
  start_date: string;
  end_date: string;
  user?: {
    name: string;
    email: string;
  };
  car?: {
    brand: string;
    model: string;
    image_path?: string | null;
  };
}
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { getCarImage } from '../lib/carImages';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const { user, token } = useAuth();

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<DashboardCar | null>(null);

  // Form fields state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [pricePerDay, setPricePerDay] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');
  const [passengerCapacity, setPassengerCapacity] = useState(5);
  const [luggageCapacity, setLuggageCapacity] = useState<string>('2');
  const [status, setStatus] = useState('available');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');

  // Backend state
  const [cars, setCars] = useState<DashboardCar[]>([]);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Tab & Rentals states
  const [activeTab, setActiveTab] = useState<'overview' | 'rentals' | 'fleet'>('overview');
  const [rentalsSearchQuery, setRentalsSearchQuery] = useState('');
  const [rentalsFilter, setRentalsFilter] = useState('all');
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(null);

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updated = await response.json();
        // Update local state
        setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
      } else {
        const err = await response.json();
        alert(err.message || "Failed to update booking status.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status due to network error.");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const fetchDashboardData = () => {
    setLoading(true);
    fetch('/api/cars?status=all')
      .then(res => res.json())
      .then(carsData => {
        const mapped = carsData.map((c: DashboardCar) => {
          return {
            ...c,
            name: c.model,
            type: c.category || 'Sedan',
            price: parseInt(c.price_per_day),
            image: c.image_path || getCarImage(c.brand, c.model)
          };
        });
        setCars(mapped);
        
        return fetch('/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      })
      .then(res => res ? res.json() : [])
      .then(bookingsData => {
        setBookings(bookingsData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Handle Add Car
  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('year', year.toString());
      formData.append('price_per_day', parseFloat(pricePerDay).toString());
      formData.append('fuel_type', fuelType);
      formData.append('passenger_capacity', passengerCapacity.toString());
      formData.append('luggage_capacity', luggageCapacity.toString());
      formData.append('status', status);
      formData.append('category', category);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowAddModal(false);
        setImageFile(null);
        fetchDashboardData();
      } else {
        const errors = await response.json();
        alert(errors.message || "Failed to add car.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add car.");
    }
  };

  // Handle Edit Click
  const handleEditClick = (car: DashboardCar) => {
    setSelectedCar(car);
    setBrand(car.brand);
    setModel(car.name);
    setYear(car.year || 2024);
    setPricePerDay(car.price.toString());
    setFuelType(car.fuelType || car.fuel_type || 'Diesel');
    setPassengerCapacity(car.passengers || car.passenger_capacity || 5);
    setLuggageCapacity((car.luggage_capacity || 2).toString());
    setStatus(car.status);
    setCategory(car.category || '');
    setImageFile(null);
    setShowEditModal(true);
  };

  // Handle Edit Car
  const handleEditCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('year', year.toString());
      formData.append('price_per_day', parseFloat(pricePerDay).toString());
      formData.append('fuel_type', fuelType);
      formData.append('passenger_capacity', passengerCapacity.toString());
      formData.append('luggage_capacity', luggageCapacity.toString());
      formData.append('status', status);
      formData.append('category', category);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`/api/cars/${selectedCar.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedCar(null);
        setImageFile(null);
        fetchDashboardData();
      } else {
        const errors = await response.json();
        alert(errors.message || "Failed to update car.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update car.");
    }
  };

  // Handle Delete Car
  const handleDeleteCar = async (carId: number) => {
    if (!confirm("Are you sure you want to delete this car? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        alert("Failed to delete car.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete car.");
    }
  };

  // Stats Dynamic Calculation
  const stats = useMemo(() => {
    const grossRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);
    const activeRentals = cars.filter(c => c.status === 'rented').length;
    const totalFleet = cars.length;
    const utilizationRate = totalFleet > 0 ? Math.round((activeRentals / totalFleet) * 100) : 0;
    const uniqueUsersCount = bookings.reduce((acc, b) => {
      if (!acc.includes(b.user_id)) acc.push(b.user_id);
      return acc;
    }, []).length;

    return {
      grossRevenue: `${grossRevenue.toLocaleString()} MAD`,
      activeRentals: activeRentals.toString(),
      utilizationRate: `${utilizationRate}%`,
      newMembers: uniqueUsersCount > 0 ? uniqueUsersCount.toString() : '0'
    };
  }, [cars, bookings]);

  // Chart Configurations
  const monthlyRevenueData = useMemo(() => {
    const monthlySum = [0, 0, 0, 0, 0, 0];
    bookings.forEach(b => {
      const date = new Date(b.created_at || b.start_date);
      const monthIdx = date.getMonth();
      if (monthIdx >= 0 && monthIdx < 6) {
        monthlySum[monthIdx] += parseFloat(b.total_price || 0);
      }
    });
    return monthlySum;
  }, [bookings]);

  const revenueData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Revenue',
      data: monthlyRevenueData.every(x => x === 0) ? [12500, 15000, 18500, 22000, 28000, 35000] : monthlyRevenueData,
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  }), [monthlyRevenueData]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Economic: 0,
      Compact: 0,
      Sedan: 0,
      SUV: 0,
      Automatic: 0,
      '7 seter car': 0
    };
    cars.forEach(car => {
      const typeStr = (car.type || '').toLowerCase();
      if (typeStr.includes('economic')) counts['Economic']++;
      if (typeStr.includes('compact')) counts['Compact']++;
      if (typeStr.includes('sedan')) counts['Sedan']++;
      if (typeStr.includes('suv')) counts['SUV']++;
      if (typeStr.includes('automatic')) counts['Automatic']++;
      if (typeStr.includes('7 seter') || typeStr.includes('7 seater')) counts['7 seter car']++;
    });
    return Object.values(counts);
  }, [cars]);

  const fleetDistribution = useMemo(() => ({
    labels: ['Economic', 'Compact', 'Sedan', 'SUV', 'Automatic', '7 seter car'],
    datasets: [{
      data: categoryCounts.every(x => x === 0) ? [30, 20, 15, 15, 10, 10] : categoryCounts,
      backgroundColor: [
        '#06b6d4', // Economic
        '#8b5cf6', // Compact
        '#10b981', // Sedan
        '#f59e0b', // SUV
        '#ec4899', // Automatic
        '#3b82f6', // 7 seter car
      ],
      borderWidth: 0,
    }]
  }), [categoryCounts]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111',
        titleColor: '#06b6d4',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#666' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } }
    }
  };

  const filteredCars = useMemo(() => {
    return cars.filter(car => 
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      car.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cars, searchQuery]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Filter by status
      if (rentalsFilter !== 'all' && b.status.toLowerCase() !== rentalsFilter.toLowerCase()) return false;

      // Filter by search query
      if (rentalsSearchQuery) {
        const query = rentalsSearchQuery.toLowerCase();
        const renterName = (b.user?.name || '').toLowerCase();
        const renterEmail = (b.user?.email || '').toLowerCase();
        const carName = (b.car ? `${b.car.brand} ${b.car.model}` : '').toLowerCase();
        return renterName.includes(query) || renterEmail.includes(query) || carName.includes(query);
      }
      return true;
    });
  }, [bookings, rentalsFilter, rentalsSearchQuery]);

  const rentalsStats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status.toLowerCase() === 'pending').length;
    const approved = bookings.filter(b => b.status.toLowerCase() === 'approved').length;
    const rejected = bookings.filter(b => ['rejected', 'cancelled'].includes(b.status.toLowerCase())).length;

    return { total, pending, approved, rejected };
  }, [bookings]);

  const getBookingStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'approved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="h-[75vh] w-full flex items-center justify-center bg-[#050505] text-white">
        <div className="text-center px-4">
          <Activity className="w-12 h-12 text-cyan-500 animate-pulse mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Restricted Access</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">You do not have administrative privileges to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#050505] min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 space-y-8 hidden lg:block shrink-0">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <Activity className="text-cyan-500 w-6 h-6" />
            <span className="font-black italic uppercase tracking-tighter text-xl">Admin<span className="text-cyan-500">Node</span></span>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'rentals', label: 'Rentals Hub', icon: Calendar },
              { id: 'fleet', label: 'Fleet Sync', icon: Car },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as 'overview' | 'rentals' | 'fleet')}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all text-left",
                  activeTab === item.id 
                    ? "bg-cyan-500 text-black font-black" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {activeTab === 'overview' && 'Command Center'}
              {activeTab === 'rentals' && 'Rentals Hub'}
              {activeTab === 'fleet' && 'Fleet Sync'}
            </h1>
            <p className="text-gray-500">
              {activeTab === 'overview' && 'Real-time platform analytics and resource management.'}
              {activeTab === 'rentals' && 'Review and approve or reject user fleet reservations.'}
              {activeTab === 'fleet' && 'Manage vehicle records, prices, and availability.'}
            </p>
          </div>
          {activeTab === 'fleet' && (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  setBrand('');
                  setModel('');
                  setYear(2024);
                  setPricePerDay('');
                  setFuelType('Diesel');
                  setPassengerCapacity(5);
                  setLuggageCapacity('2');
                  setStatus('available');
                  setImageFile(null);
                  setShowAddModal(true);
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Provision New Car</span>
              </button>
            </div>
          )}
        </header>

        {/* Mobile/Tablet Segmented Navigation */}
        <div className="lg:hidden flex border-b border-white/5 pb-4 mb-8 overflow-x-auto gap-2 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'rentals', label: 'Rentals Hub', icon: Calendar },
            { id: 'fleet', label: 'Fleet Sync', icon: Car },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as 'overview' | 'rentals' | 'fleet')}
              className={cn(
                "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shrink-0 border",
                activeTab === item.id
                  ? "bg-cyan-500 text-black border-cyan-500 font-black shadow-lg shadow-cyan-500/10"
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-[50vh] w-full flex items-center justify-center">
            <Loader2 className="animate-spin text-cyan-500 w-12 h-12" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {[
                    { label: 'Gross Revenue', value: stats.grossRevenue, trend: '+15.2%', icon: DollarSign, trendUp: true },
                    { label: 'Active Rentals', value: stats.activeRentals, trend: '+8.4%', icon: Car, trendUp: true },
                    { label: 'Avg Util Rate', value: stats.utilizationRate, trend: '+3.1%', icon: TrendingUp, trendUp: true },
                    { label: 'New Members', value: stats.newMembers, trend: '+20.5%', icon: Users, trendUp: true },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#111] border border-white/5 p-8 rounded-3xl group hover:border-cyan-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div className={cn(
                          "flex items-center text-xs font-bold font-mono",
                          stat.trendUp ? "text-green-500" : "text-red-500"
                        )}>
                          {stat.trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                          {stat.trend}
                        </div>
                      </div>
                      <div className="text-3xl font-black italic uppercase tracking-tighter mb-1">{stat.value}</div>
                      <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                  <div className="lg:col-span-8 bg-[#111] border border-white/5 p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-bold uppercase tracking-widest text-gray-300">Revenue Velocity</h3>
                      <select className="bg-transparent text-xs font-bold uppercase text-cyan-500 focus:outline-none">
                        <option>Last 6 Months</option>
                      </select>
                    </div>
                    <div className="h-[300px]">
                      <Line data={revenueData} options={chartOptions} />
                    </div>
                  </div>
                  <div className="lg:col-span-4 bg-[#111] border border-white/5 p-8 rounded-3xl px-8 py-8 flex flex-col">
                    <h3 className="text-xl font-bold uppercase tracking-widest text-gray-300 mb-10">Fleet Mix</h3>
                    <div className="flex-1 flex items-center justify-center py-6 px-6">
                      <div className="relative w-full aspect-square max-w-[200px]">
                        <Doughnut data={fleetDistribution} options={{ plugins: { legend: { display: false } }, cutout: '75%' }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black italic mb-0">{cars.length}</span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase">Vehicles</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/5">
                      {fleetDistribution.labels.map((label, i) => (
                        <div key={label} className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: fleetDistribution.datasets[0].backgroundColor[i] }} />
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'fleet' && (
              /* Table Section */
              <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-gray-300">Car Status Management</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                        type="text" 
                        placeholder="Search fleet..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none text-white" 
                      />
                    </div>
                    <button className="p-2 border border-white/10 rounded-xl hover:bg-white/10">
                      <Filter className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        <th className="px-8 py-5">Vehicle Name</th>
                        <th className="px-8 py-5">Category</th>
                        <th className="px-8 py-5">Current Price</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Capacity</th>
                        <th className="px-8 py-5 text-right pr-12">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                      {filteredCars.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-gray-500 uppercase text-xs tracking-widest font-bold">
                            No fleet vehicles found.
                          </td>
                        </tr>
                      ) : (
                        filteredCars.map((car) => (
                          <tr key={car.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                  <img src={car.image} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <div className="text-white font-bold group-hover:text-cyan-500 transition-colors uppercase italic">{car.brand} {car.name}</div>
                                  <div className="text-[10px] text-gray-500 font-bold uppercase">Year {car.year}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs uppercase tracking-widest text-gray-400">{car.type}</span>
                            </td>
                            <td className="px-8 py-6 text-cyan-500 font-bold">{car.price} MAD</td>
                            <td className="px-8 py-6">
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                                car.status === 'available' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                car.status === 'rented' ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" :
                                "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              )}>
                                {car.status}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {car.passenger_capacity || car.passengers || 5} Seats / {car.luggage_capacity || 2} Luggage
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right pr-12">
                              <div className="flex justify-end items-center space-x-3">
                                <button 
                                  onClick={() => handleEditClick(car)}
                                  className="text-cyan-500 hover:text-cyan-400 transition-colors p-1"
                                  title="Edit Car"
                                >
                                  <Edit2 className="w-4.5 h-4.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCar(car.id)}
                                  className="text-red-500/70 hover:text-red-500 transition-colors p-1"
                                  title="Delete Car"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  <span>Showing {filteredCars.length} of {cars.length} Vehicles</span>
                </div>
              </div>
            )}

            {activeTab === 'rentals' && (
              <>
                {/* Rentals Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {[
                    { label: 'Total Bookings', value: rentalsStats.total, icon: Calendar, color: 'text-cyan-500' },
                    { label: 'Pending Requests', value: rentalsStats.pending, icon: Loader2, color: 'text-yellow-500', pulse: rentalsStats.pending > 0 },
                    { label: 'Approved Rentals', value: rentalsStats.approved, icon: Check, color: 'text-green-500' },
                    { label: 'Rejected/Cancelled', value: rentalsStats.rejected, icon: X, color: 'text-red-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#111] border border-white/5 p-8 rounded-3xl group hover:border-cyan-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                          "p-3 bg-white/5 rounded-2xl group-hover:bg-cyan-500 group-hover:text-black transition-all",
                          stat.color
                        )}>
                          <stat.icon className={cn("w-5 h-5", stat.pulse && "animate-spin")} />
                        </div>
                      </div>
                      <div className="text-3xl font-black italic uppercase tracking-tighter mb-1">{stat.value}</div>
                      <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Table Section */}
                <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold uppercase tracking-widest text-gray-300">Renter Reservations</h3>
                    <div className="flex items-center space-x-4 flex-wrap gap-2">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                          type="text" 
                          placeholder="Search bookings..." 
                          value={rentalsSearchQuery}
                          onChange={(e) => setRentalsSearchQuery(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none text-white w-64" 
                        />
                      </div>
                      
                      {/* Filter Status */}
                      <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected', 'cancelled'].map(f => (
                          <button
                            key={f}
                            onClick={() => setRentalsFilter(f)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                              rentalsFilter === f
                                ? "bg-cyan-500 text-black border-cyan-500 font-black"
                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20"
                            )}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                          <th className="px-8 py-5">Renter Profile</th>
                          <th className="px-8 py-5">Vehicle</th>
                          <th className="px-8 py-5">Rental Duration</th>
                          <th className="px-8 py-5">Total Charge</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right pr-12">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-medium">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-gray-500 uppercase text-xs tracking-widest font-bold">
                              No matching reservations found.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((booking) => {
                            const renterInitials = (booking.user?.name || 'GU').substring(0, 2).toUpperCase();
                            const carImg = booking.car?.image_path || getCarImage(booking.car?.brand ?? '', booking.car?.model ?? '');
                            const start = new Date(booking.start_date);
                            const end = new Date(booking.end_date);
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                            return (
                              <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-black font-black uppercase text-sm shrink-0 shadow-lg shadow-cyan-500/10">
                                      {renterInitials}
                                    </div>
                                    <div>
                                      <div className="text-white font-bold group-hover:text-cyan-500 transition-colors uppercase italic">
                                        {booking.user?.name || 'Guest User'}
                                      </div>
                                      <div className="text-[10px] text-gray-500 font-bold">{booking.user?.email || 'N/A'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-7 bg-gray-800 rounded overflow-hidden shrink-0">
                                      <img src={carImg} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <span className="text-white font-bold uppercase italic block text-xs">
                                        {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Unknown Vehicle'}
                                      </span>
                                      <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                                        {booking.car ? `${booking.car.price_per_day} MAD / Day` : ''}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="text-white text-xs">
                                    {booking.start_date.split('T')[0]} <span className="text-cyan-500">→</span> {booking.end_date.split('T')[0]}
                                  </div>
                                  <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-1">
                                    {days} Day{days !== 1 ? 's' : ''}
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-cyan-500 font-black text-sm">
                                  {parseFloat(booking.total_price).toLocaleString()} MAD
                                </td>
                                <td className="px-8 py-6">
                                  <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                                    getBookingStatusBadge(booking.status)
                                  )}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-right pr-12">
                                  <div className="flex justify-end items-center space-x-3">
                                    {updatingBookingId === booking.id ? (
                                      <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                                    ) : (
                                      <>
                                        {booking.status.toLowerCase() === 'pending' ? (
                                          <>
                                            <button 
                                              onClick={() => handleUpdateBookingStatus(booking.id, 'approved')}
                                              className="bg-green-500/10 hover:bg-green-500 hover:text-black border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center space-x-1 active:scale-95"
                                              title="Accept Booking"
                                            >
                                              <Check className="w-3.5 h-3.5" />
                                              <span>Accept</span>
                                            </button>
                                            <button 
                                              onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                                              className="bg-red-500/10 hover:bg-red-500 hover:text-black border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center space-x-1 active:scale-95"
                                              title="Reject Booking"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                              <span>Reject</span>
                                            </button>
                                          </>
                                        ) : (
                                          <button 
                                            onClick={() => handleUpdateBookingStatus(booking.id, 'pending')}
                                            className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border border-white/5"
                                            title="Revert to Pending"
                                          >
                                            Reset Status
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    <span>Showing {filteredBookings.length} of {bookings.length} Reservations</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Provision New Car Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-6 text-white">Provision New Car</h3>
              <form onSubmit={handleAddCar} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Brand</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dacia, Renault"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Model Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Logan, Clio 5"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Year</label>
                    <input 
                      type="number" 
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Price Per Day (MAD)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 300"
                      value={pricePerDay}
                      onChange={(e) => setPricePerDay(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Fuel Preference</label>
                  <select 
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white appearance-none"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Economic, Compact, Automatic"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Seats Count</label>
                    <input 
                      type="number" 
                      value={passengerCapacity}
                      onChange={(e) => setPassengerCapacity(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Luggage Capacity</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 3 large, 2 large + 1 small"
                      value={luggageCapacity}
                      onChange={(e) => setLuggageCapacity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Initial Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white appearance-none"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Car Image</label>
                  <div className="relative border border-dashed border-white/10 hover:border-cyan-500/50 rounded-xl p-4 transition-all bg-white/5 flex flex-col items-center justify-center text-center cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 mb-2 transition-colors" />
                    {imageFile ? (
                      <span className="text-cyan-500 text-xs font-bold truncate max-w-full">
                        {imageFile.name}
                      </span>
                    ) : (
                      <>
                        <span className="text-gray-400 text-xs font-bold">Select Vehicle Photo</span>
                        <span className="text-gray-600 text-[10px] uppercase font-bold tracking-wider mt-1">PNG, JPG, WEBP up to 4MB</span>
                      </>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all mt-6"
                >
                  Provision Car
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Car Modal */}
      <AnimatePresence>
        {showEditModal && selectedCar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCar(null);
                }}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-6 text-white">Edit Fleet Vehicle</h3>
              <form onSubmit={handleEditCar} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Brand</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dacia, Renault"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Model Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Logan, Clio 5"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Year</label>
                    <input 
                      type="number" 
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Price Per Day (MAD)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 300"
                      value={pricePerDay}
                      onChange={(e) => setPricePerDay(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Fuel Preference</label>
                  <select 
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white appearance-none"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Economic, Compact, Automatic"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Seats Count</label>
                    <input 
                      type="number" 
                      value={passengerCapacity}
                      onChange={(e) => setPassengerCapacity(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Luggage Capacity</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 3 large, 2 large + 1 small"
                      value={luggageCapacity}
                      onChange={(e) => setLuggageCapacity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                 <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Vehicle Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white appearance-none"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Update Car Image</label>
                  <div className="relative border border-dashed border-white/10 hover:border-cyan-500/50 rounded-xl p-4 transition-all bg-white/5 flex flex-col items-center justify-center text-center cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 mb-2 transition-colors" />
                    {imageFile ? (
                      <span className="text-cyan-500 text-xs font-bold truncate max-w-full">
                        {imageFile.name}
                      </span>
                    ) : (
                      <>
                        <span className="text-gray-400 text-xs font-bold">Select New Photo (Optional)</span>
                        <span className="text-gray-600 text-[10px] uppercase font-bold tracking-wider mt-1">PNG, JPG, WEBP up to 4MB</span>
                      </>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all mt-6"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
