'use client';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-transparent">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link href="/" className="font-bold text-xl text-foreground">
          Booking<span className="text-accent">Hostel</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Home</Link>
          <Link href="/contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Contact</Link>
          <Link href="/admin" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            👑 Admin
          </Link>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all bg-white/90 text-foreground hover:text-foreground hover:bg-white"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ fontSize: '20px' }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

      </div>
    </nav>
  );
}