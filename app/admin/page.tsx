'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import FixedHeader from '../components/FixedHeader';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total_bookings: 0,
    total_payments: 0,
    total_rooms: 0,
    available_rooms: 0
  });

  // Calculate stats dynamically from localStorage
  const calculateStats = () => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');

    const totalBookings = bookings.length;
    const totalPayments = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r: any) => r.available !== false).length;

    setStats({
      total_bookings: totalBookings,
      total_payments: totalPayments,
      total_rooms: totalRooms,
      available_rooms: availableRooms
    });
  };

  useEffect(() => {
    calculateStats();
    // Refresh stats every 5 seconds
    const interval = setInterval(calculateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('adminAuth');
      const authTime = localStorage.getItem('adminAuthTime');
      const username = localStorage.getItem('adminUsername');
      const lastVisit = localStorage.getItem('adminLastVisit');
      const currentPage = window.location.pathname;
      
      // Check if this is a new visit (user came back to the page)
      const currentTime = new Date().getTime();
      if (lastVisit && currentPage === '/admin') {
        const timeSinceLastVisit = currentTime - parseInt(lastVisit);
        const maxAwayTime = 1 * 1000; // 1 second
        
        // If user was away for more than 1 second, require re-authentication
        if (timeSinceLastVisit > maxAwayTime) {
          console.log('User was away too long, requiring re-authentication...');
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminAuthTime');
          localStorage.removeItem('adminUsername');
          localStorage.removeItem('adminLastVisit');
          router.push('/admin/login');
          return;
        }
      }
      
      // Check if authentication exists
      if (!authStatus || authStatus !== 'true') {
        console.log('No auth status found, redirecting to login...');
        router.push('/admin/login');
        return;
      }
      
      // Check if authentication is recent (within 1 hour for better security)
      if (authTime) {
        const authAge = currentTime - parseInt(authTime);
        const maxAge = 60 * 60 * 1000; // 1 hour instead of 24 hours
        
        if (authAge > maxAge) {
          console.log('Authentication expired, redirecting to login...');
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminAuthTime');
          localStorage.removeItem('adminUsername');
          localStorage.removeItem('adminLastVisit');
          router.push('/admin/login');
          return;
        }
      }
      
      // Check if username exists
      if (!username) {
        console.log('No username found, redirecting to login...');
        router.push('/admin/login');
        return;
      }
      
      // Update last visit time
      localStorage.setItem('adminLastVisit', currentTime.toString());
      
      console.log('Authentication valid, user:', username);
    };
    
    checkAuth();
    
    // Check authentication every 30 seconds
    const interval = setInterval(checkAuth, 30000);
    
    // Update last visit time every minute
    const visitInterval = setInterval(() => {
      localStorage.setItem('adminLastVisit', new Date().getTime().toString());
    }, 60000);
    
    return () => {
      clearInterval(interval);
      clearInterval(visitInterval);
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <Navbar />
      <FixedHeader />
      <div className="pt-48 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">👑 Admin Dashboard</h1>
            <p className="text-white/60">Manage your hostel booking system</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <span>🔄</span> Refresh Stats
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminAuthTime');
                localStorage.removeItem('adminUsername');
                localStorage.removeItem('adminLastVisit');
                router.push('/admin/login');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <span>🚪</span> Logout
            </button>
            <button
              onClick={() => router.push('/')} 
              className="bg-white text-[#0a1628] px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all"
            >
              Back to Site
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 rounded-full p-3 shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-sm font-bold text-blue-600">Total</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 drop-shadow-lg">{stats?.total_bookings ?? 0}</h3>
            <p className="text-gray-700 font-medium">Total Bookings</p>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 rounded-full p-3 shadow-lg">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-sm font-bold text-green-600">Total</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 drop-shadow-lg">UGX {stats?.total_payments ?? 0}</h3>
            <p className="text-gray-700 font-medium">Total Payments</p>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 rounded-full p-3 shadow-lg">
                <span className="text-2xl">🏠</span>
              </div>
              <span className="text-sm font-bold text-purple-600">Total</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 drop-shadow-lg">{stats?.total_rooms ?? 0}</h3>
            <p className="text-gray-700 font-medium">Total Rooms</p>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 rounded-full p-3 shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
              <span className="text-sm font-bold text-orange-600">Available</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 drop-shadow-lg">{stats?.available_rooms ?? 0}</h3>
            <p className="text-gray-700 font-medium">Available Rooms</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => router.push('/admin/bookings')}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 text-left hover:bg-yellow-50 transition-all group shadow-xl border-2 border-white/50"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white rounded-full p-3 group-hover:bg-blue-600 transition-all shadow-lg">
                <span className="text-xl">📅</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2 drop-shadow">Manage Bookings</h3>
            <p className="text-gray-700 font-medium text-sm">View and manage all reservations</p>
          </button>

          <button
            onClick={() => router.push('/admin/payments')}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 text-left hover:bg-green-50 transition-all group shadow-xl border-2 border-white/50"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-500 text-white rounded-full p-3 group-hover:bg-green-600 transition-all shadow-lg">
                <span className="text-xl">💳</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2 drop-shadow">Manage Payments</h3>
            <p className="text-gray-700 font-medium text-sm">Track and manage payments</p>
          </button>

          <button
            onClick={() => router.push('/admin/rooms')}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 text-left hover:bg-purple-50 transition-all group shadow-xl border-2 border-white/50"
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 text-white rounded-full p-3 group-hover:bg-purple-600 transition-all shadow-lg">
                <span className="text-xl">🏠</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2 drop-shadow">Manage Rooms</h3>
            <p className="text-gray-700 font-medium text-sm">Add and manage rooms</p>
          </button>

          <button
            onClick={() => router.push('/admin/availability')}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 text-left hover:bg-orange-50 transition-all group shadow-xl border-2 border-white/50"
          >
            <div className="flex items-center mb-4">
              <div className="bg-orange-500 text-white rounded-full p-3 group-hover:bg-orange-600 transition-all shadow-lg">
                <span className="text-xl">📆</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2 drop-shadow">Availability</h3>
            <p className="text-gray-700 font-medium text-sm">Manage room availability</p>
          </button>
        </div>
      </div>
    </main>
  );
}
