import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  LayoutDashboard, 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Settings, 
  Menu, 
  X, 
  Globe, 
  Moon, 
  Sun,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { cn } from './lib/utils';
import './i18n';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';

// Pages (to be implemented)
import LandingPage from './pages/LandingPage';
import CarListingPage from './pages/CarListingPage';
import CarDetailsPage from './pages/CarDetailsPage';
import RecommendationWizard from './pages/RecommendationWizard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, setShowAuthModal } = useAuth();

  const navItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.cars'), path: '/cars' },
    { name: t('nav.dashboard'), path: '/dashboard' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Zap className="text-black w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">TEIMA <span className="text-cyan-500">CARS</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-cyan-400",
                  location.pathname === item.path ? "text-cyan-500" : "text-gray-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
              {['en', 'fr', 'ar'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold transition-all uppercase",
                    i18n.language === lang ? "bg-cyan-500 text-black" : "text-gray-400 hover:text-white"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest hidden lg:block">{user.name}</span>
                <button onClick={logout} className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="p-2 text-gray-400 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black border-b border-white/10 absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-lg font-medium text-white hover:text-cyan-500 border-b border-white/5"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="text-cyan-500 w-6 h-6" />
            <span className="text-xl font-bold text-white uppercase tracking-wider">Teima Cars</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Revolutionizing urban mobility with premium AI-driven rental solutions. Experience the peak of automotive technology.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/cars" className="hover:text-cyan-500 transition-colors">Browse Fleet</Link></li>
            <li><Link to="/pricing" className="hover:text-cyan-500 transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Safety</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
        &copy; {new Date().getFullYear()} Teima Cars. All rights reserved.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-500">
          <Navbar />
          <AuthModal />
          <main className="pt-20 min-h-[calc(100vh-80px)]">
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Zap className="animate-pulse text-cyan-500 w-12 h-12" /></div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/cars" element={<CarListingPage />} />
              <Route path="/cars/:id" element={<CarDetailsPage />} />
              <Route path="/wizard" element={<RecommendationWizard />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      </Router>
    </AuthProvider>
  );
}
