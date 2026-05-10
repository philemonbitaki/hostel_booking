'use client';
import { useState, useEffect } from 'react';
import AdminProtection from '../components/AdminProtection';
import FeedbackDisplay from '../../components/FeedbackDisplay';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState('Dashboard loaded - Ready to use');
  const [showFeedbacks, setShowFeedbacks] = useState(false);

  const confirmBooking = async (booking: any) => {
    if (!confirm(`Confirm booking for ${booking.guest}?`)) return;
    
    // Update booking status
    const updatedBookings = bookings.map(b => 
      b.id === booking.id ? { ...b, status: 'confirmed' } : b
    );
    setBookings(updatedBookings);
    setStatusMessage(`Booking confirmed for ${booking.guest}`);
    
    // Send confirmation email to client
    try {
      const response = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: booking.email,
          guestName: booking.guest,
          roomName: booking.room,
          price: booking.price,
          bookingId: booking.id
        })
      });
      
      if (response.ok) {
        alert(`✅ Booking confirmed and email sent to ${booking.email}`);
      } else {
        alert(`⚠️ Booking confirmed but email failed`);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      alert(`⚠️ Booking confirmed but email failed`);
    }
  };

  const initialBookings = [
    { id: 1, guest: 'Marie Dubois', email: 'marie@email.com', room: 'New Generation', price: 360, status: 'confirmed' },
    { id: 2, guest: 'Jean Martin', email: 'jean@email.com', room: 'Annex', price: 405, status: 'cancelled' },
    { id: 3, guest: 'Sophie Bernard', email: 'sophie@email.com', room: 'Hudreb', price: 495, status: 'confirmed' },
    { id: 4, guest: 'Pierre Leroy', email: 'pierre@email.com', room: 'Campus View Residence', price: 2250, status: 'confirmed' },
    { id: 5, guest: 'Claire Petit', email: 'claire@email.com', room: "Scholar's Hub", price: 270, status: 'confirmed' },
    { id: 6, guest: 'Lucas Robert', email: 'lucas@email.com', room: 'Green Campus Dorm', price: 315, status: 'cancelled' },
    { id: 7, guest: 'Emma Moreau', email: 'emma@email.com', room: 'New Generation', price: 405, status: 'cancelled' }
  ];

  useEffect(() => {
    // Load bookings from localStorage first
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    if (storedBookings.length > 0) {
      setBookings(storedBookings);
    } else {
      setBookings([...initialBookings]);
    }
  }, []);

  const showCount = () => {
    alert('📊 Bookings: ' + bookings.length);
    setStatusMessage('Count: ' + bookings.length);
  };

  const clearAll = () => {
    if (confirm('Delete ALL bookings?')) {
      setBookings([]);
      setStatusMessage('All deleted!');
      alert('✅ All bookings deleted!');
    }
  };

  const reloadAll = () => {
    if (confirm('Reload all bookings?')) {
      setBookings([...initialBookings]);
      setStatusMessage('Reloaded!');
      alert('✅ Bookings reloaded!');
    }
  };

  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  const revenue = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.price, 0);

  return (
    <AdminProtection>
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', padding: '20px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '32px', margin: '0' }}>📊 Admin Dashboard</h1>
            <p style={{ color: '#6b7280', margin: '5px 0' }}>Booking Management System</p>
          </div>

          {/* Management Section */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '15px' }}>🎛️ Manage Bookings</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>View and manage all reservations</p>
            
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <button 
                onClick={clearAll}
                style={{ 
                  padding: '12px 20px', 
                  margin: '5px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  backgroundColor: '#dc2626',
                  color: 'white'
                }}
              >
                🗑️ DELETE ALL
              </button>
              <button 
                onClick={reloadAll}
                style={{ 
                  padding: '12px 20px', 
                  margin: '5px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  backgroundColor: '#2563eb',
                  color: 'white'
                }}
              >
                🔄 RELOAD
              </button>
              <button 
                onClick={showCount}
                style={{ 
                  padding: '12px 20px', 
                  margin: '5px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  backgroundColor: '#16a34a',
                  color: 'white'
                }}
              >
                📊 COUNT
              </button>
            </div>
            
            <div style={{ backgroundColor: '#e5e7eb', padding: '10px', borderRadius: '4px', margin: '10px 0' }}>
              <strong>Status:</strong> <span>{statusMessage}</span>
            </div>
          </div>

          {/* Bookings List */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px' }}>📋 Customer Bookings</h2>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                📭 No bookings found
              </div>
            ) : (
              <div>
                {bookings.map((booking) => (
                  <div key={booking.id} style={{ backgroundColor: '#f9fafb', padding: '15px', margin: '10px 0', borderLeft: '4px solid #3b82f6', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold' }}>{booking.guest}</div>
                    <div style={{ color: '#666', fontSize: '14px' }}>{booking.email}</div>
                    <div style={{ color: '#666', fontSize: '14px' }}>{booking.room} - ${booking.price}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '4px 8px', 
                        backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : '#fecaca', 
                        color: booking.status === 'confirmed' ? '#166534' : '#991b1b', 
                        borderRadius: '4px', 
                        fontSize: '12px' 
                      }}>
                        {booking.status}
                      </span>
                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => confirmBooking(booking)}
                          style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            backgroundColor: '#16a34a',
                            color: 'white'
                          }}
                        >
                          ✅ Confirm
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Section */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0 }}>⭐ Customer Feedbacks</h2>
              <button 
                onClick={() => setShowFeedbacks(!showFeedbacks)}
                style={{ 
                  padding: '8px 16px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  backgroundColor: '#8b5cf6',
                  color: 'white'
                }}
              >
                {showFeedbacks ? 'Hide' : 'Show'} Feedbacks
              </button>
            </div>
            {showFeedbacks && (
              <div style={{ marginTop: '20px' }}>
                <FeedbackDisplay limit={10} showForm={false} isAdmin={true} />
              </div>
            )}
          </div>

          {/* Statistics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Total</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{total}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Confirmed</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{confirmed}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Cancelled</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{cancelled}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Revenue</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>${revenue}</div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
