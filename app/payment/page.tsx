'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Récupérer les paramètres de la réservation
  const roomId = searchParams.get('roomId');
  const roomName = searchParams.get('roomName') || 'Chambre Deluxe';
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const amount = parseFloat(searchParams.get('amount') || '45');
  const nights = searchParams.get('nights') || '1';
  const guestName = searchParams.get('guestName') || '';
  const guestEmail = searchParams.get('guestEmail') || '';
  const guestPhone = searchParams.get('guestPhone') || '';
  const specialRequests = searchParams.get('specialRequests') || '';

  useEffect(() => {
    // Simuler une réservation existante
    if (!roomId || !checkIn || !checkOut) {
      setError('Informations de réservation manquantes');
    }
  }, [roomId, checkIn, checkOut]);

  const router = useRouter();
  const handlePayment = async (paymentMethod: 'mtn' | 'airtel') => {
    setLoading(true);
    setError('');

    try {
      // Create booking object
      const booking = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        guestName: guestName || '',
        guestEmail: guestEmail || '',
        guestPhone: guestPhone || '',
        roomId: roomId || '',
        roomName: roomName || '',
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        nights: parseInt(nights || '1'),
        amount: amount,
        specialRequests: specialRequests || '',
        paymentMethod: paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('realBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('realBookings', JSON.stringify(existingBookings));

      console.log('Booking saved:', booking);

      // Redirect to success page
      router.push(`/payment/success?bookingId=${booking.id}&roomName=${encodeURIComponent(roomName || '')}&checkIn=${encodeURIComponent(checkIn || '')}&checkOut=${encodeURIComponent(checkOut || '')}&nights=${encodeURIComponent(nights || '1')}&amount=${encodeURIComponent(amount.toString())}`);
      return;

    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto pt-20 pb-12 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your reservation for {roomName} has been confirmed.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Reservation Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">{roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Paid:</span>
                  <span className="text-green-600">{amount}€</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link 
                href="/booking" 
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View My Reservations
              </Link>
              <Link 
                href="/" 
                className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-20 pb-12 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Payment</h1>
          <p className="text-gray-600">Select your preferred payment method</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Room</p>
                  <p className="font-medium">{roomName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-medium">{checkIn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-medium">{checkOut}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nights</p>
                  <p className="font-medium">{nights}</p>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">{amount}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-6">Payment Method</h2>

              <div className="space-y-4">
                {/* MTN Mobile Money */}
                <div className="border-2 border-yellow-200 rounded-lg p-4 hover:border-yellow-400 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">�</span>
                      </div>
                      <div>
                        <p className="font-bold text-yellow-800">MTN Mobile Money</p>
                        <p className="text-sm text-yellow-600">Send to: 0766615673</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePayment('mtn')}
                      disabled={loading}
                      className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay with MTN'}
                    </button>
                  </div>
                </div>

                {/* Airtel Money */}
                <div className="border-2 border-red-200 rounded-lg p-4 hover:border-red-400 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">📱</span>
                      </div>
                      <div>
                        <p className="font-bold text-red-800">Airtel Money</p>
                        <p className="text-sm text-red-600">Send to: 0756661543</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePayment('airtel')}
                      disabled={loading}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay with Airtel'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Information */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-green-800">Secure Payment</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment information is secure. We never store your payment details.
                </p>
              </div>

              {/* Cancel Button */}
              <div className="mt-6 text-center">
                <Link
                  href="/booking"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  ← Cancel and return to booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-white">Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
