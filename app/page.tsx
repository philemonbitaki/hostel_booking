'use client';
import Navbar from './components/Navbar';
import Link from 'next/link';
import { useTheme } from './contexts/ThemeContext';
import FeedbackDisplay from './components/FeedbackDisplay';
import FixedHeader from './components/FixedHeader';

export default function Home() {
  const { isDarkMode } = useTheme();

  return (
    <main className={`min-h-screen relative ${isDarkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
      {/* Background Image - Home Page Only */}
      <div 
        className="fixed inset-0 z-0 opacity-90"
        style={{
          backgroundImage: 'url("/hostels/hundreb.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/10 via-black/5 to-black/20" />
      
      <Navbar />
      <FixedHeader />

      {/* Hero Section */}
      <div className="pt-48 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
            Find Your Perfect <span className="text-yellow-300">Hostel</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/70">
            Discover affordable and comfortable hostel accommodations for your next adventure
          </p>
        </div>
      </div>



      {/* Hostels Section */}
      <div className="px-6 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Choose Your Hostel Type</h2>
            <p className={isDarkMode ? 'text-white/60' : 'text-gray-600'}>Select the perfect hostel for your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* University Hostel Card */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center rounded-t-2xl">
                <div className="text-6xl">🎓</div>
              </div>
              <div className="p-8">
                <h3 className="text-h3 font-bold text-foreground mb-4">University Hostel</h3>
                <p className="text-foreground/70 mb-6">
                  Perfect for students and academic visitors. Located near campus with study-friendly environment and affordable rates.
                </p>
                <ul className="text-foreground/70 mb-6 space-y-2">
                  <li className="flex items-center">
                    <span className="text-success mr-2">✓</span>
                    Study rooms available
                  </li>
                  <li className="flex items-center">
                    <span className="text-success mr-2">✓</span>
                    High-speed WiFi
                  </li>
                  <li className="flex items-center">
                    <span className="text-success mr-2">✓</span>
                    Quiet environment
                  </li>
                  <li className="flex items-center">
                    <span className="text-success mr-2">✓</span>
                    Student discounts
                  </li>
                </ul>
                <Link 
                  href="/hostels/university" 
                  className="w-full btn btn-primary hover:scale-105 transition-all"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Private Hostel Card */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center rounded-t-2xl">
                <div className="text-6xl">🏠</div>
              </div>
              <div className="p-8">
                <h3 className="text-h3 font-bold text-foreground mb-4">Private Hostel</h3>
                <p className="text-foreground/70 mb-6">
                  Ideal for travelers and professionals seeking privacy and comfort. Premium amenities with personalized service.
                </p>
                <ul className="text-foreground/70 mb-6 space-y-2">
                  <li className="flex items-center">
                    <span className="text-success mr-2">✓</span>
                    Private rooms available
                  </li>
                  <li className="flex items-center">
                    <span className="text-success mr-2">✓</span>
                    Premium amenities
                  </li>
                  <li className="flex items-center">
                    <span className="text-success mr-2">✓</span>
                    24/7 reception
                  </li>
                  <li className="flex items-center">
                    <span className="text-success mr-2">✓</span>
                    City center location
                  </li>
                </ul>
                <Link 
                  href="/hostels/private" 
                  className="w-full btn btn-primary hover:scale-105 transition-all"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`${isDarkMode ? 'bg-white/10' : 'bg-gray-100'} backdrop-blur-sm py-16 px-6 relative z-10`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">💰</div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Affordable Prices</h3>
              <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>Budget-friendly accommodations without compromising quality</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📍</div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Prime Locations</h3>
              <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>Strategically located hostels near major attractions</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Safe & Secure</h3>
              <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>Your safety is our top priority with 24/7 security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>What Our Guests Say</h2>
            <p className={isDarkMode ? 'text-white/60' : 'text-gray-600'}>Read reviews from our satisfied customers</p>
          </div>
          <FeedbackDisplay limit={3} showForm={true} />
        </div>
      </div>
    </main>
  );
}