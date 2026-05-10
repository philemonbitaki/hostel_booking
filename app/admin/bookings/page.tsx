'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminProtection from '../components/AdminProtection';
import { deleteBooking } from '../../lib/bookings-storage';

interface BookingWithGuest {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  specialRequests?: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const mockBookings: BookingWithGuest[] = [
  {
    id: 'be985b52-1234-5678-9abc-123456789001',
    guestName: 'Marie Dubois',
    guestEmail: 'marie.dubois@email.com',
    guestPhone: '+33 6 12 34 56 78',
    roomId: '1',
    roomName: 'Single Room - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-08',
    nights: 8,
    amount: 360,
    specialRequests: 'Quiet room, high floor',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    createdAt: new Date('2026-04-25').toISOString()
  },
  {
    id: '193f2e11-1234-5678-9abc-123456789002',
    guestName: 'Jean Martin',
    guestEmail: 'jean.martin@email.com',
    guestPhone: '+33 6 23 45 67 89',
    roomId: '1',
    roomName: 'Single Room - University Hostel',
    checkIn: '2026-05-07',
    checkOut: '2026-05-16',
    nights: 9,
    amount: 405,
    specialRequests: '',
    paymentMethod: 'paypal',
    status: 'cancelled',
    createdAt: new Date('2026-04-26').toISOString()
  },
  {
    id: 'b4afa924-1234-5678-9abc-123456789003',
    guestName: 'Sophie Bernard',
    guestEmail: 'sophie.bernard@email.com',
    guestPhone: '+33 6 34 56 78 90',
    roomId: '3',
    roomName: 'Deluxe Suite - Private Hostel',
    checkIn: '2026-05-09',
    checkOut: '2026-05-20',
    nights: 11,
    amount: 495,
    specialRequests: 'City view',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    createdAt: new Date('2026-04-27').toISOString()
  },
  {
    id: 'c271bd25-1234-5678-9abc-123456789004',
    guestName: 'Pierre Leroy',
    guestEmail: 'pierre.leroy@email.com',
    guestPhone: '+33 6 45 67 89 01',
    roomId: '3',
    roomName: 'Deluxe Suite - Private Hostel',
    checkIn: '2026-05-08',
    checkOut: '2026-05-23',
    nights: 15,
    amount: 2250,
    specialRequests: 'Equipped kitchenette',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    createdAt: new Date('2026-04-28').toISOString()
  },
  {
    id: '3e173aec-1234-5678-9abc-123456789005',
    guestName: 'Claire Petit',
    guestEmail: 'claire.petit@email.com',
    guestPhone: '+33 6 56 78 90 12',
    roomId: '1',
    roomName: 'Single Room - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-06',
    nights: 6,
    amount: 270,
    specialRequests: '',
    paymentMethod: 'bank_transfer',
    status: 'confirmed',
    createdAt: new Date('2026-04-29').toISOString()
  },
  {
    id: 'f41eba4c-1234-5678-9abc-123456789006',
    guestName: 'Lucas Robert',
    guestEmail: 'lucas.robert@email.com',
    guestPhone: '+33 6 67 89 01 23',
    roomId: '1',
    roomName: 'Single Room - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-07',
    nights: 7,
    amount: 315,
    specialRequests: 'Close to transport',
    paymentMethod: 'credit_card',
    status: 'cancelled',
    createdAt: new Date('2026-04-30').toISOString()
  },
  {
    id: '0a65eff6-1234-5678-9abc-123456789007',
    guestName: 'Emma Moreau',
    guestEmail: 'emma.moreau@email.com',
    guestPhone: '+33 6 78 90 12 34',
    roomId: '2',
    roomName: 'Double Room - Private Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-09',
    nights: 9,
    amount: 405,
    specialRequests: 'Private bathroom',
    paymentMethod: 'paypal',
    status: 'confirmed',
    createdAt: new Date('2026-05-01').toISOString()
  }
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingWithGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<{from: string, to: string}>({from: '', to: ''});
  
  const router = useRouter();

  useEffect(() => {
    // Get mock bookings
    let allBookings = [...mockBookings];
    
    // Get bookings from localStorage (new customer bookings)
    try {
      const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      if (storedBookings.length > 0) {
        allBookings = [...allBookings, ...storedBookings];
        console.log('Loaded', storedBookings.length, 'bookings from localStorage');
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
    
    // Sort by creation date (newest first)
    allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setBookings(allBookings);
    setLoading(false);
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      setBookings(updatedBookings);
      
      // Update localStorage
      try {
        const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const updatedStored = storedBookings.map((booking: any) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        );
        localStorage.setItem('bookings', JSON.stringify(updatedStored));
      } catch (e) {
        console.error('Error updating localStorage:', e);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Delete from localStorage
      try {
        const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const updatedStored = storedBookings.filter((booking: any) => booking.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedStored));
      } catch (e) {
        console.error('Error updating localStorage:', e);
      }
      
      // Update local state
      const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
      setBookings(updatedBookings);
      
      // Show success message
      alert('Booking deleted successfully!');
    } catch (err) {
      setError('An error occurred while deleting the booking');
      console.error('Error deleting booking:', err);
    }
  };

  // Refresh bookings from localStorage
  const refreshBookings = () => {
    setLoading(true);
    let allBookings = [...mockBookings];
    
    try {
      const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      if (storedBookings.length > 0) {
        allBookings = [...allBookings, ...storedBookings];
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
    
    allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(allBookings);
    setLoading(false);
  };

  const filteredBookings = bookings.filter(booking => {
    // Apply status filter
    const statusMatch = filter === 'all' || booking.status === filter;
    
    // Apply search filter
    const searchMatch = searchTerm === '' ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply date filter
    const dateMatch = (!dateFilter.from || new Date(booking.checkIn) >= new Date(dateFilter.from)) &&
                      (!dateFilter.to || new Date(booking.checkOut) <= new Date(dateFilter.to));
    
    return statusMatch && searchMatch && dateMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Loading bookings...</div>
      </main>
    );
  }

  return (
    <AdminProtection>
      <main className="min-h-screen bg-[#0a1628]">
        <div className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📅 Manage Bookings</h1>
            <p className="text-white/60">View and manage all reservations</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-[#1a2332] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                aria-label="Search bookings"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter(prev => ({...prev, from: e.target.value}))}
                className="px-4 py-2 border border-gray-600 rounded-lg bg-[#1a2332] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Start date filter"
              />
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter(prev => ({...prev, to: e.target.value}))}
                className="px-4 py-2 border border-gray-600 rounded-lg bg-[#1a2332] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="End date filter"
              />
            </div>
            <button
              onClick={refreshBookings}
              className="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-all"
            >
              🔄 Refresh Bookings
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="bg-white text-[#0a1628] px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 mb-6 inline-flex">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                filter === status
                  ? 'bg-[#0a1628] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.guestName}
                      <div className="text-gray-500">{booking.guestEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.roomName}
                      <div className="text-gray-500">${booking.amount/booking.nights}/night</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.checkIn).toLocaleDateString()}
                      <div className="text-gray-500">to {new Date(booking.checkOut).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <> 
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete booking"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No bookings found</div>
              <div className="text-gray-400 text-sm mt-2">
                {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter} bookings found.`}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    </AdminProtection>
  );
}
