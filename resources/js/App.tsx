import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Zap
} from 'lucide-react';
import { cn } from './lib/utils';
import './i18n';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './contexts/ThemeContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import AuthModal from './components/AuthModal';

// Pages (to be implemented)
import LandingPage from './pages/LandingPage';
import CarListingPage from './pages/CarListingPage';
import CarDetailsPage from './pages/CarDetailsPage';
import RecommendationWizard from './pages/RecommendationWizard';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';

function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, setShowAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
        setIsOpen(false); // Close mobile menu when scrolling down
      } else {
        setVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.cars'), path: '/cars' },
  ];

  if (user) {
    if (user.role === 'admin') {
      navItems.push({ name: t('nav.dashboard'), path: '/admin' });
    } else {
      navItems.push({ name: t('nav.profile'), path: '/profile' });
    }
  } else {
    navItems.push({ name: t('nav.profile'), path: '/profile' });
  }

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 transition-transform duration-300",
      visible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="flex items-center group relative z-10">
            <img 
              src={theme === 'dark' ? '/images/logoWhite.png' : '/images/logoDark.png'} 
              className="h-24 md:h-32 w-auto object-contain transition-all duration-300 py-1 drop-shadow-2xl" 
              alt="Teima Cars Logo" 
            />
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
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 border border-white/10"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors uppercase tracking-widest hidden lg:block">
                  {user.name}
                </Link>
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

          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-1">
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
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center mb-4">
            <img 
              src={theme === 'dark' ? '/images/logoWhite.png' : '/images/logoDark.png'} 
              className="h-8 w-auto object-contain" 
              alt="Teima Cars Logo" 
            />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            Revolutionizing urban mobility with premium AI-driven rental solutions. Experience the peak of automotive technology.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/cars" className="hover:text-cyan-500 transition-colors">Browse Fleet</Link></li>
            {user && (
              <li><Link to="/profile" className="hover:text-cyan-500 transition-colors">Profile</Link></li>
            )}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
        &copy; {new Date().getFullYear()} Teima Cars. All rights reserved.
      </div>
    </footer>
  );
}

function AppContent() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-500 transition-colors duration-300">
      <Navbar />
      <AuthModal />
      <main className="pt-20 md:pt-24 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)]">
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Zap className="animate-pulse text-cyan-500 w-12 h-12" /></div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cars" element={<CarListingPage />} />
            <Route path="/cars/:id" element={<CarDetailsPage />} />
            <Route path="/wizard" element={<RecommendationWizard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
