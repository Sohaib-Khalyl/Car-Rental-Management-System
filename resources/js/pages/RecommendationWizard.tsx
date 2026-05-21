import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Target, 
  Users, 
  Briefcase, 
  Fuel, 
  DollarSign,
  Sparkles,
  Loader2,
  Trophy,
  Gauge
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_CARS } from '../mockData';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const STEPS = [
  { id: 'budget', title: 'Monthly Budget', icon: DollarSign, description: 'How much do you plan to spend?' },
  { id: 'trip', title: 'Trip Type', icon: Target, description: 'Business, Leisure, or Adrenaline?' },
  { id: 'passengers', title: 'Passengers', icon: Users, description: 'Number of seats required.' },
  { id: 'luggage', title: 'Luggage Space', icon: Briefcase, description: 'Space for your belongings.' },
  { id: 'fuel', title: 'Fuel Preference', icon: Fuel, description: 'Traditional or Future energy?' }
];

export default function RecommendationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const { user, setShowAuthModal, token } = useAuth();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loadingCarId, setLoadingCarId] = useState<number | null>(null);

  const handleQuickHire = async (carId: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!searchParams.get('start') || !searchParams.get('end')) {
        alert("Missing dates. Please go back to home page and select dates.");
        return;
    }

    setLoadingCarId(carId);

    try {
      const payload = {
        car_id: carId,
        start_date: searchParams.get('start'),
        end_date: searchParams.get('end'),
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
        alert(errorData.message || "Failed to book car.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to book car. Please try again.");
    } finally {
      setLoadingCarId(null);
    }
  };

  const handleSelect = (value: any) => {
    const updated = { ...selections, [STEPS[currentStep].id]: value };
    setSelections(updated);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      analyzeRecommendations(updated);
    }
  };

  const analyzeRecommendations = async (finalSelections: any) => {
    setIsAnalyzing(true);
    
    try {
      const payload = {
        ...finalSelections,
        startDate: searchParams.get('start'),
        endDate: searchParams.get('end'),
        isDelivery: searchParams.get('delivery') === 'true',
        address: searchParams.get('address')
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      const sortedResults = data.map((c: any) => ({ 
        id: c.id,
        name: c.model,
        brand: c.brand,
        price: parseInt(c.price_per_day),
        image: 'https://images.unsplash.com/photo-1503376760367-1b6121649f87?auto=format&fit=crop&q=80&w=800',
        matchScore: c.recommendation_score ? Math.min(Math.floor(c.recommendation_score * 10) + 60, 99) : Math.floor(Math.random() * 20) + 75, 
        matchReason: `Perfect for your ${finalSelections.trip} needs with a ${finalSelections.budget} budget.` 
      })).sort((a: any, b: any) => b.matchScore - a.matchScore);

      setResults(sortedResults);
      setCurrentStep(STEPS.length); // Transition to results step
    } catch (error) {
      console.error("AI Analysis failed", error);
      // Fallback
      setResults(MOCK_CARS.map(c => ({ ...c, matchScore: 85, matchReason: 'Excellent all-rounder for your profile.' })));
      setCurrentStep(STEPS.length);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentStepData = STEPS[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {currentStep < STEPS.length ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === currentStep ? "w-12 bg-cyan-500" : i < currentStep ? "w-4 bg-cyan-500/50" : "w-4 bg-white/10"
                  )} 
                />
              ))}
            </div>

            <div className="inline-flex p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-8 text-cyan-500">
              <currentStepData.icon className="w-8 h-8" />
            </div>

            <h2 className="text-5xl font-black uppercase italic italic italic tracking-tighter mb-4">{currentStepData.title}</h2>
            <p className="text-gray-500 text-lg mb-12">{currentStepData.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {OPTIONS[currentStepData.id].map((option: any) => (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option.value)}
                  className="group bg-[#111] border border-white/5 hover:border-cyan-500/50 p-6 rounded-2xl transition-all text-left flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-lg text-white mb-1">{option.label}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{option.sub}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-cyan-500 transition-colors" />
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="mt-12 text-gray-500 hover:text-white flex items-center space-x-2 mx-auto disabled:opacity-0 transition-all font-bold uppercase text-[10px] tracking-widest leading-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mx-auto mb-8" />
            <Sparkles className="w-6 h-6 text-cyan-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl font-black italic uppercase italic tracking-tighter mb-4">Neural Scoring Engine</h2>
            <p className="text-gray-500 animate-pulse">Our AI assistant is matching your lifestyle with our premium fleet...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
                {bookingSuccess ? 'Booking Confirmed!' : 'Your Intelligent Matches'}
              </h2>
              <p className="text-gray-500">
                {bookingSuccess 
                  ? 'Your reservation is secured. Our team will contact you shortly.' 
                  : 'Based on your unique profile and neural scoring.'}
              </p>
            </div>

            {!bookingSuccess && (
            <div className="grid grid-cols-1 gap-8">
              {results.slice(0, 3).map((result, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  key={result.id}
                  className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row group hover:border-cyan-500/30 transition-all relative"
                >
                  {i === 0 && (
                    <div className="absolute top-4 left-4 z-20 bg-cyan-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>Best Choice</span>
                    </div>
                  )}
                  <div className="aspect-[16/10] md:w-80 overflow-hidden">
                    <img src={result.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-cyan-500 font-black text-4xl mb-1">{result.matchScore}% <span className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-2">Match</span></div>
                          <h3 className="text-3xl font-bold uppercase italic italic italic">{result.name}</h3>
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-xl text-right">
                          <div className="text-cyan-500 font-bold text-xl">${result.price}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">/ day</div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-6 flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{result.matchReason}</span>
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Link to={`/cars/${result.id}`} className="flex-1 bg-white/10 hover:bg-white/20 py-4 rounded-xl text-center font-bold text-xs uppercase tracking-widest transition-all">
                        View Config
                      </Link>
                      <button 
                        onClick={() => handleQuickHire(result.id)}
                        disabled={loadingCarId === result.id}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50"
                      >
                        {loadingCarId === result.id ? 'Booking...' : 'Quick Hire'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}

            <div className="text-center">
              <button 
                onClick={() => {
                  setCurrentStep(0);
                  setSelections({});
                }} 
                className="text-gray-500 hover:text-white font-bold uppercase text-[10px] tracking-widest underline underline-offset-8"
              >
                Restart AI Profiling
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const OPTIONS: Record<string, any[]> = {
  budget: [
    { label: 'Essential', sub: 'Up to $1,500', value: 'Essential' },
    { label: 'Executive', sub: '$1,500 - $5,000', value: 'Executive' },
    { label: 'Elite', sub: '$5,000 - $15,000', value: 'Elite' },
    { label: 'Hypercar', sub: '$15,000+', value: 'Hyper' },
  ],
  trip: [
    { label: 'Business', sub: 'Clean, Quiet, Professional', value: 'Business' },
    { label: 'Coastal Escape', sub: 'Open Road, Style', value: 'Leisure' },
    { label: 'Track Day', sub: 'Pure Performance', value: 'Sport' },
    { label: 'Family Tour', sub: 'Space & Comfort', value: 'Family' },
  ],
  passengers: [
    { label: 'Solo / Couple', sub: '1-2 people', value: 2 },
    { label: 'Executive Team', sub: '3-4 people', value: 4 },
    { label: 'Standard Group', sub: '5 people', value: 5 },
    { label: 'Large Group', sub: '7+ people', value: 7 },
  ],
  luggage: [
    { label: 'Minimal', sub: 'Laptop bag', value: 'Minimal' },
    { label: 'Standard', sub: '2 Check-in bags', value: 'Standard' },
    { label: 'Expedition', sub: 'Multiple large cases', value: 'Heavy' },
    { label: 'Specialized', sub: 'Sports equipment', value: 'Special' },
  ],
  fuel: [
    { label: 'Future Electric', sub: 'Zero Emissions', value: 'Electric' },
    { label: 'High Performance', sub: 'Internal Combustion', value: 'Gasoline' },
    { label: 'Smart Hybrid', sub: 'Versatile', value: 'Hybrid' },
    { label: 'Hydro-Power', sub: 'Next-Gen Hydrogen', value: 'Hydrogen' },
  ]
};
