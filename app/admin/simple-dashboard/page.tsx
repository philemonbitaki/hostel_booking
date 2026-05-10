'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import AdminProtection from '../components/AdminProtection';

export default function SimpleDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState('Dashboard loaded - Ready to use');
  const lastKnownCountRef = useRef(0);

  const initialBookings = [
    { id: '1', guestName: 'Marie Dubois', email: 'marie@email.com', room: 'New Generation', price: 360, status: 'confirmed' },
    { id: '2', guestName: 'Jean Martin', email: 'jean@email.com', room: 'Annex', price: 405, status: 'cancelled' },
    { id: '3', guestName: 'Sophie Bernard', email: 'sophie@email.com', room: 'Hudreb', price: 495, status: 'confirmed' },
    { id: '4', guestName: 'Pierre Leroy', email: 'pierre@email.com', room: 'Campus View Residence', price: 2250, status: 'confirmed' },
    { id: '5', guestName: 'Claire Petit', email: 'claire@email.com', room: "Scholar's Hub", price: 270, status: 'confirmed' },
    { id: '6', guestName: 'Lucas Robert', email: 'lucas@email.com', room: 'Green Campus Dorm', price: 315, status: 'cancelled' },
    { id: '7', guestName: 'Emma Moreau', email: 'emma@email.com', room: 'New Generation', price: 405, status: 'cancelled' }
  ];

  const loadBookings = useCallback((isAuto = false) => {
    // Load bookings from localStorage only (dynamic data)
    let allBookings = [];
    let storedCount = 0;
    
    try {
      const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      storedCount = storedBookings.length;
      if (storedCount > 0) {
        // Convert stored format to display format
        const formattedStored = storedBookings.map((b: any) => ({
          id: b.id,
          guestName: b.guestName,
          email: b.guestEmail,
          room: b.roomName,
          price: b.amount,
          status: b.status
        }));
        allBookings = [...formattedStored];
      } else {
        // Fallback to initial bookings only if no stored bookings
        allBookings = [...initialBookings];
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      allBookings = [...initialBookings];
    }
    
    // Update the last known count
    lastKnownCountRef.current = allBookings.length;
    
    setBookings(allBookings);
    
    if (isAuto && storedCount > 0) {
      setStatusMessage('✅ NEW BOOKING! Total: ' + allBookings.length + ' bookings');
    } else {
      setStatusMessage('Dashboard loaded - ' + allBookings.length + ' bookings total');
    }
  }, []);

  useEffect(() => {
    // Load initially
    loadBookings(false);
    
    // Auto-refresh every 2 seconds to check for new bookings
    const interval = setInterval(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('bookings') || '[]');
        const newCount = initialBookings.length + stored.length;
        
        if (newCount !== lastKnownCountRef.current) {
          console.log('New booking detected! Count changed from', lastKnownCountRef.current, 'to', newCount);
          loadBookings(true);
        }
      } catch (e) {
        console.error('Error checking localStorage:', e);
      }
    }, 2000);
    
    // Also listen for storage events (when other tabs modify localStorage)
    const handleStorageChange = () => {
      console.log('Storage event detected!');
      loadBookings(true);
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Reload when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page visible again, reloading...');
        loadBookings(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadBookings]);

  const showCount = () => {
    alert('📊 NUMBER OF BOOKINGS: ' + bookings.length);
    setStatusMessage('Count displayed: ' + bookings.length + ' bookings');
  };

  const clearAll = () => {
    setStatusMessage('Attempting to clear...');
    alert('⚠️ YOU CLICKED ON "CLEAR ALL"');
    
    if (window.confirm('🚨 WARNING! Do you really want to delete ALL bookings?')) {
      setBookings([]);
      // Also clear from localStorage
      localStorage.removeItem('bookings');
      setStatusMessage('✅ ALL BOOKINGS HAVE BEEN DELETED!');
      alert('✅ SUCCESS! All bookings have been deleted from dashboard and storage!');
    } else {
      setStatusMessage('❌ Deletion cancelled');
    }
  };

  const reloadAll = () => {
    setStatusMessage('Attempting to reload...');
    alert('🔄 YOU CLICKED ON "RELOAD"');
    
    if (window.confirm('🔄 Do you want to reload all bookings including new customer bookings?')) {
      loadBookings(false);
      alert('✅ SUCCESS! All bookings have been reloaded including new customer bookings!');
    } else {
      setStatusMessage('❌ Reload cancelled');
    }
  };

  // Statistics are calculated directly in the render to ensure they update

  return (
    <AdminProtection>
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', padding: '20px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 style={{ color: '#1f2937', fontSize: '32px', margin: '0' }}>📊 Admin Dashboard</h1>
            <p style={{ color: '#6b7280', margin: '5px 0' }}>Booking Management System</p>
          </div>

          {/* Button Section */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '15px' }}>🎛️ Manage Bookings</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>View and manage all reservations</p>
            
            {/* VERY VISIBLE BUTTONS */}
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={clearAll}
                style={{ 
                  padding: '15px 25px', 
                  margin: '10px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  display: 'inline-block'
                }}
              >
                🗑️ DELETE ALL BOOKINGS
              </button>
              <button 
                onClick={reloadAll}
                style={{ 
                  padding: '15px 25px', 
                  margin: '10px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  display: 'inline-block'
                }}
              >
                🔄 RELOAD ALL (+ NEW)
              </button>
              <button 
                onClick={showCount}
                style={{ 
                  padding: '15px 25px', 
                  margin: '10px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  display: 'inline-block'
                }}
              >
                📊 SHOW COUNT
              </button>
            </div>
            
            {/* Status Area */}
            <div style={{ backgroundColor: '#e5e7eb', padding: '10px', borderRadius: '4px', margin: '10px 0' }}>
              <strong>Status:</strong> <span>{statusMessage}</span>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>📋 Customer Bookings</h2>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '18px' }}>
                📭 NO BOOKINGS FOUND
              </div>
            ) : (
              <div>
                {bookings.map((booking) => (
                  <div key={booking.id} style={{ backgroundColor: '#f9fafb', padding: '15px', margin: '10px 0', borderLeft: '4px solid #3b82f6', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{booking.guestName}</div>
                    <div style={{ color: '#6b7280' }}>{booking.email}</div>
                    <div style={{ color: '#6b7280' }}>{booking.room} - ${booking.price}</div>
                    <div style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: booking.status === 'confirmed' ? '#16a34a' : '#dc2626', color: 'white', borderRadius: '4px', fontSize: '12px', marginTop: '5px' }}>
                      {booking.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Bookings</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{bookings.length}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Confirmed</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{bookings.filter(b => b.status === 'confirmed').length}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Cancelled</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{bookings.filter(b => b.status === 'cancelled').length}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Revenue</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>UGX {bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.price, 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
