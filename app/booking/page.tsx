'use client';
import Navbar from '../components/Navbar';
import FixedHeader from '../components/FixedHeader';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// Mock data to avoid import errors
const mockRooms = [
  {
    id: '1',
    name: 'Single Room - University Hostel',
    description: 'Comfortable room for students with desk and wardrobe',
    capacity: 1,
    price_per_night: 25,
    image_url: '/images/room1.jpg',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Double Room - Private Hostel',
    description: 'Spacious double room with private bathroom',
    capacity: 2,
    price_per_night: 45,
    image_url: '/images/room2.jpg',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Deluxe Suite - Private Hostel',
    description: 'Luxurious suite with view and kitchenette',
    capacity: 3,
    price_per_night: 80,
    image_url: '/images/room3.jpg',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
import { Room } from '../types/database';
import { saveBooking } from '../../lib/real-bookings';

function BookingPageContent() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');

  // Load rooms and pre-select room if roomId is provided
  useEffect(() => {
    // Use mock data to avoid errors
    setRooms(mockRooms as Room[]);
    
    // Pre-select room if roomId is in URL
    if (roomId) {
      const room = mockRooms.find(r => r.id === roomId);
      if (room) {
        setSelectedRoom(room as Room);
      }
    }
  }, [roomId]);

  const handleBooking = async () => {
    if (!selectedRoom || !checkIn || !checkOut) {
      setError('Please select a room and dates');
      return;
    }

    if (!guestName || !guestEmail) {
      setError('Please fill in your full name and email');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Calculate number of nights
      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = calculateTotal();

      // Create booking object to save
      const newBooking = {
        id: 'booking-' + Date.now(),
        guestName: guestName,
        guestEmail: guestEmail,
        guestPhone: guestPhone || '',
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        checkIn: checkIn,
        checkOut: checkOut,
        nights: nights,
        amount: totalPrice,
        specialRequests: specialRequests || '',
        paymentMethod: paymentMethod,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage for admin dashboard
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));
      console.log('Booking saved to localStorage:', newBooking);

      // Send confirmation email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: guestEmail,
            guestName,
            roomName: selectedRoom.name,
            checkIn,
            checkOut,
            totalPrice,
            bookingId: newBooking.id
          })
        });
      } catch (emailError) {
        console.log('Email sending failed, but booking continues:', emailError);
      }

      // Redirect to payment page with parameters
      const paymentParams = new URLSearchParams({
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        checkIn,
        checkOut,
        amount: totalPrice.toString(),
        nights: nights.toString(),
        guestName,
        guestEmail,
        guestPhone: guestPhone || '',
        specialRequests: specialRequests || '',
        paymentMethod
      });

      router.push(`/payment?${paymentParams.toString()}`);
    } catch (err) {
      setError('An error occurred during payment preparation');
      setLoading(false);
    }
  };

  // Calculate nights and total price
  const calculateTotal = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0;
    
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return nights * selectedRoom.price_per_night;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2332]">
      <Navbar />
      <FixedHeader />
      <div className="pt-48 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🏨 Book Your Stay</h1>
          <p className="text-white/60 text-lg">Choose your room and complete your booking securely</p>
          <p className="text-white/40 text-sm mt-2">Created by Philemon Bitaki - BookingHostel</p>
        </div>

        {submitted ? (
          <div className="bg-green-500 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-white text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-white/80 mt-2">Your booking has been successfully created.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 bg-white text-green-600 px-6 py-2 rounded-full font-bold inline-block"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-xl">⚠️</span>
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                )}
                
                {/* Room Selection */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">🏠 Choose Your Room</h2>
                  <div className="space-y-4">
                    {rooms.map(room => (
                      <div 
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selectedRoom?.id === room.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl">
                            🏨
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{room.name}</h3>
                            <p className="text-gray-600 text-sm">{room.description}</p>
                            <p className="text-blue-600 font-bold mt-1">${room.price_per_night} per night</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedRoom?.id === room.id 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {selectedRoom?.id === room.id && <span className="text-white text-sm">✓</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guest Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Your Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ color: '#111827' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input 
                        type="email" 
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="john.smith@email.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ color: '#111827' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input 
                        type="tel" 
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ color: '#111827' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Stay Dates</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ color: '#111827' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        style={{ color: '#111827' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                  <textarea 
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Let us know of any special requests (quiet room, view, etc.)..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    style={{ color: '#111827' }}
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">💳 Payment Method</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { value: 'credit_card', label: 'Credit Card', icon: '💳' },
                      { value: 'paypal', label: 'PayPal', icon: '📱' },
                      { value: 'cash', label: 'Cash on Arrival', icon: '💵' }
                    ].map(method => (
                      <div 
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value)}
                        className={`border-2 rounded-lg p-3 cursor-pointer text-center transition-all ${
                          paymentMethod === method.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className="text-sm font-medium">{method.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={loading || !selectedRoom || !checkIn || !checkOut || !guestName || !guestEmail}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Loading...
                    </span>
                  ) : (
                    <span>Proceed to Payment - ${calculateTotal()}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Booking Summary</h3>
                
                {selectedRoom ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900">{selectedRoom.name}</h4>
                      <p className="text-gray-600 text-sm">{selectedRoom.description}</p>
                      <p className="text-blue-600 font-bold mt-2">${selectedRoom.price_per_night} per night</p>
                    </div>
                    
                    {checkIn && checkOut && (
                      <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Nights:</span>
                          <span className="font-bold">
                            {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Guest:</span>
                          <span className="font-bold">{guestName || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                          <span>Total:</span>
                          <span>${calculateTotal()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">🏨</div>
                    <p>Select a room to see the summary</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-white">Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}
