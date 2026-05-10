'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminProtection from '../components/AdminProtection';

interface Payment {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

const mockPayments: Payment[] = [
  {
    id: 'pay-001',
    bookingId: 'be985b52',
    guestName: 'Marie Dubois',
    guestEmail: 'marie.dubois@email.com',
    amount: 360,
    paymentMethod: 'credit_card',
    status: 'completed',
    createdAt: '2026-04-25'
  },
  {
    id: 'pay-002',
    bookingId: '193f2e11',
    guestName: 'Jean Martin',
    guestEmail: 'jean.martin@email.com',
    amount: 405,
    paymentMethod: 'paypal',
    status: 'completed',
    createdAt: '2026-04-26'
  },
  {
    id: 'pay-003',
    bookingId: 'b4afa924',
    guestName: 'Sophie Bernard',
    guestEmail: 'sophie.bernard@email.com',
    amount: 495,
    paymentMethod: 'credit_card',
    status: 'completed',
    createdAt: '2026-04-27'
  }
];

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  
  const router = useRouter();

  useEffect(() => {
    // Load mock payments and any from localStorage
    let allPayments = [...mockPayments];
    
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const storedPayments = bookings
        .filter((b: any) => b.status === 'confirmed')
        .map((b: any, index: number) => ({
          id: 'pay-' + (100 + index),
          bookingId: b.id.slice(0, 8),
          guestName: b.guestName,
          guestEmail: b.guestEmail,
          amount: b.amount,
          paymentMethod: b.paymentMethod,
          status: 'completed' as const,
          createdAt: b.createdAt.slice(0, 10)
        }));
      allPayments = [...allPayments, ...storedPayments];
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
    
    setPayments(allPayments);
    setLoading(false);
  }, []);

  const handleStatusUpdate = async (paymentId: string, newStatus: 'pending' | 'completed' | 'failed') => {
    try {
      // Update local state
      setPayments(payments.map(payment => 
        payment.id === paymentId ? { ...payment, status: newStatus } : payment
      ));
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const filteredPayments = payments.filter(payment => 
    filter === 'all' || payment.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Loading payments...</div>
      </main>
    );
  }

  return (
    <AdminProtection>
      <main className="min-h-screen bg-[#0a1628]">
        <div className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">💳 Manage Payments</h1>
            <p className="text-white/60">Track and manage all payments</p>
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

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 mb-6 inline-flex">
          {(['all', 'pending', 'completed', 'failed'] as const).map((status) => (
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

        {/* Payments Table */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.bookingId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.guestName}
                      <div className="text-gray-500">{payment.guestEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentMethod.replace('_', ' ').charAt(0).toUpperCase() + 
                       payment.paymentMethod.replace('_', ' ').slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                      <div className="text-gray-500">{new Date(payment.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(payment.id, 'completed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(payment.id, 'failed')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Fail
                            </button>
                          </>
                        )}
                        {payment.status === 'failed' && (
                          <button
                            onClick={() => handleStatusUpdate(payment.id, 'pending')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No payments found</div>
              <div className="text-gray-400 text-sm mt-2">
                {filter === 'all' ? 'No payments have been made yet.' : `No ${filter} payments found.`}
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">
              ${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Payments</h3>
            <p className="text-2xl font-bold text-yellow-600">
              ${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed Payments</h3>
            <p className="text-2xl font-bold text-red-600">
              ${payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </div>
        </div>
      </div>
    </main>
    </AdminProtection>
  );
}
