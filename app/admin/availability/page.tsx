'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRoomAvailability, updateRoomAvailability } from '../../lib/database';
import { RoomAvailability } from '../../types/database';
import AdminProtection from '../components/AdminProtection';

export default function AdminAvailability() {
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  
  const router = useRouter();

  // Load availability from localStorage on mount
  useEffect(() => {
    const storedAvailability = localStorage.getItem('roomAvailability');
    if (storedAvailability) {
      setAvailability(JSON.parse(storedAvailability));
    }
  }, []);

  const loadAvailability = async () => {
    if (!selectedRoom || !selectedDate) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await getRoomAvailability(selectedRoom, selectedDate, selectedDate);
      if (error) {
        console.log('Database error, using localStorage:', error.message);
        setUseLocalStorage(true);
        // Filter from localStorage
        const localData = availability.filter(a => 
          a.room_id === selectedRoom && a.date === selectedDate
        );
        setAvailability(localData);
      } else {
        setAvailability(data || []);
      }
    } catch (err) {
      console.log('Database error, using localStorage:', err);
      setUseLocalStorage(true);
      const localData = availability.filter(a => 
        a.room_id === selectedRoom && a.date === selectedDate
      );
      setAvailability(localData);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityUpdate = async (roomId: string, date: string, isAvailable: boolean) => {
    setError('');
    setSuccess('');
    
    try {
      // Try database first
      const { data, error } = await updateRoomAvailability(roomId, date, isAvailable);
      if (error) {
        console.log('Database update failed, using localStorage:', error.message);
        setUseLocalStorage(true);
        // Update localStorage
        const updated = availability.map(avail => 
          avail.room_id === roomId && avail.date === date ? { ...avail, is_available: isAvailable } : avail
        );
        
        // If not found, add new entry
        if (!updated.some(a => a.room_id === roomId && a.date === date)) {
          updated.push({
            id: `local-${Date.now()}`,
            room_id: roomId,
            date: date,
            is_available: isAvailable,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
        setAvailability(updated);
        localStorage.setItem('roomAvailability', JSON.stringify(updated));
        setSuccess(`Room ${roomId} availability updated to ${isAvailable ? 'Available' : 'Unavailable'} (saved locally)`);
      } else {
        setAvailability(availability.map(avail => 
          avail.room_id === roomId && avail.date === date ? { ...avail, is_available: isAvailable } : avail
        ));
        setSuccess(`Room ${roomId} availability updated to ${isAvailable ? 'Available' : 'Unavailable'} (saved to database)`);
      }
    } catch (err) {
      console.log('Database update failed, using localStorage:', err);
      setUseLocalStorage(true);
      const updated = availability.map(avail => 
        avail.room_id === roomId && avail.date === date ? { ...avail, is_available: isAvailable } : avail
      );
      
      if (!updated.some(a => a.room_id === roomId && a.date === date)) {
        updated.push({
          id: `local-${Date.now()}`,
          room_id: roomId,
          date: date,
          is_available: isAvailable,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      setAvailability(updated);
      localStorage.setItem('roomAvailability', JSON.stringify(updated));
      setSuccess(`Room ${roomId} availability updated to ${isAvailable ? 'Available' : 'Unavailable'} (saved locally)`);
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSearch = () => {
    loadAvailability();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Loading availability...</div>
      </main>
    );
  }

  return (
    <AdminProtection>
      <main className="min-h-screen bg-[#0a1628]">
        <div className="pt-24 px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">📆 Manage Availability</h1>
              <p className="text-white/60">Manage room availability</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-white text-[#0a1628] px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all"
            >
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {useLocalStorage && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              Using local storage (database not available)
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room ID</label>
                <input
                  type="text"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  placeholder="e.g., room-1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#0a1628] text-white py-2 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Availability List */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availability.map((avail) => (
                    <tr key={avail.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {avail.room_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(avail.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          avail.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {avail.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleAvailabilityUpdate(avail.room_id, avail.date, !avail.is_available)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            avail.is_available 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {avail.is_available ? 'Make Unavailable' : 'Make Available'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {availability.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No availability data found</div>
                <div className="text-gray-400 text-sm mt-2">
                  Select a room and date to view availability
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ How to use</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Enter a Room ID to filter by specific room</li>
              <li>• Select a date to view availability for that date</li>
              <li>• Click "Make Available/Unavailable" to toggle room status</li>
              <li>• Availability is automatically updated when bookings are made</li>
            </ul>
          </div>
        </div>
      </main>
    </AdminProtection>
  );
}
