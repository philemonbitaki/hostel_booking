'use client';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';

export default function FixedHeader() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-transparent backdrop-blur-lg border-b-2 border-white/30 shadow-2xl">
      <div className="px-6 py-6 text-center">
        {/* Logo/Photo Section */}
        <div className="flex justify-center items-center mb-4">
          <img
            src="/bu.jpg"
            alt="BU Logo"
            className="w-20 h-20 object-cover rounded-full shadow-xl border-2 border-white/50"
          />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl mb-4 select-none">
          BU ONLINE HOSTEL BOOKING
        </h1>

        <div className="flex justify-center items-center space-x-6 md:space-x-8 text-white text-base md:text-lg">
          <Link href="/" className="hover:text-yellow-400 transition-colors duration-200 font-bold flex items-center select-none">
            🏠 Home
          </Link>
          <Link href="/contact" className="hover:text-green-400 transition-colors duration-200 font-bold flex items-center select-none">
            📞 Contact
          </Link>
          <Link href="/admin" className="hover:text-yellow-400 transition-colors duration-200 font-bold flex items-center select-none">
            👑 Admin
          </Link>
          <button
            onClick={toggleTheme}
            className="hover:text-orange-400 transition-colors duration-200 font-bold flex items-center text-xl select-none"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
}
