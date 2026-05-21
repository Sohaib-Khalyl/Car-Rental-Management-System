import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Car, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  Download,
  Calendar,
  Activity
} from 'lucide-react';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { cn } from '../lib/utils';
import { MOCK_CARS } from '../mockData';

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
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Revenue',
      data: [12500, 15000, 18500, 22000, 28000, 35000],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const fleetDistribution = {
    labels: ['Luxury', 'SUV', 'Sports', 'Sedan'],
    datasets: [{
      data: [35, 25, 20, 20],
      backgroundColor: [
        '#06b6d4',
        '#0891b2',
        '#155e75',
        '#164e63',
      ],
      borderWidth: 0,
    }]
  };

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

  return (
    <div className="flex bg-[#050505] min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 space-y-8 hidden xl:block">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <Activity className="text-cyan-500 w-6 h-6" />
            <span className="font-black italic uppercase tracking-tighter text-xl">Admin<span className="text-cyan-500">Node</span></span>
          </div>
          <nav className="space-y-1">
            {[
              { label: 'Overview', icon: TrendingUp, active: true },
              { label: 'Fleet Sync', icon: Car },
              { label: 'User Hub', icon: Users },
              { label: 'Revenue', icon: DollarSign },
              { label: 'Scheduler', icon: Calendar },
            ].map(item => (
              <a 
                key={item.label}
                href="#" 
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                  item.active ? "bg-cyan-500 text-black" : "text-gray-500 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Command Center</h1>
            <p className="text-gray-500">Real-time platform analytics and resource management.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 text-gray-400">
              <Download className="w-5 h-5" />
            </button>
            <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Provision New Car</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Gross Revenue', value: '$284,500', trend: '+12.5%', icon: DollarSign, trendUp: true },
            { label: 'Active Rentals', value: '142', trend: '+4.2%', icon: Car, trendUp: true },
            { label: 'Avg Util Rate', value: '86%', trend: '-2.1%', icon: TrendingUp, trendUp: false },
            { label: 'New Members', value: '1,240', trend: '+18.7%', icon: Users, trendUp: true },
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
                <option>Last Year</option>
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
                  <span className="text-3xl font-black italic mb-0">94</span>
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

        {/* Table Section */}
        <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold uppercase tracking-widest text-gray-300">Car Status Management</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type="text" placeholder="Search fleet..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none" />
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
                  <th className="px-8 py-5">Utilization</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {MOCK_CARS.map((car) => (
                  <tr key={car.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                          <img src={car.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-white font-bold group-hover:text-cyan-500 transition-colors uppercase italic">{car.name}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">{car.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs uppercase tracking-widest text-gray-400">{car.type}</span>
                    </td>
                    <td className="px-8 py-6 text-cyan-500 font-bold">${car.price}</td>
                    <td className="px-8 py-6">
                      <span className="bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20">Available</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-32 bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: '75%' }} />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button className="text-gray-600 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
            <span>Showing 5 of 94 Vehicles</span>
            <div className="flex space-x-2">
              <button disabled className="px-3 py-1 border border-white/10 rounded-md opacity-50">Prev</button>
              <button className="px-3 py-1 border border-white/10 rounded-md hover:bg-white/5">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
