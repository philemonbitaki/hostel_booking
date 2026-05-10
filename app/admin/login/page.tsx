'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import FixedHeader from '../../components/FixedHeader';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Admin credentials (you can change them)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check both username and password
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store authentication in localStorage with timestamp
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', new Date().getTime().toString());
      localStorage.setItem('adminUsername', username);
      
      alert('Login successful! Redirecting to admin dashboard...');
      
      // Redirect to admin dashboard
      router.push('/admin');
    } else {
      setError('Incorrect username or password');
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <Navbar />
      <FixedHeader />
      <div className="flex items-center justify-center min-h-screen pt-48">
        <div className="max-w-md w-full mx-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-white/50">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter your password to access the administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Administrator Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border-2 border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 font-bold text-gray-900 text-lg placeholder-gray-500"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Administrator Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 font-bold text-gray-900 text-lg placeholder-gray-500"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a1628] text-white py-3 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed border-2 border-white/30 shadow-lg"
            >
              {loading ? 'Checking...' : '🔓 Access Admin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Back to Site
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              Administrator access only
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
