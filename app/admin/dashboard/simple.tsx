'use client';
import { useState, useEffect } from 'react';
import AdminProtection from '../components/AdminProtection';

export default function SimpleDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    try {
      const stored = localStorage.getItem('realBookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setBookings(parsed);
        setMessage(`✅ ${parsed.length} réservation(s) trouvée(s)`);
      } else {
        setBookings([]);
        setMessage('📭 Aucune réservation trouvée');
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error}`);
      setBookings([]);
    }
  };

  const addTestBooking = () => {
    try {
      const booking = {
        id: `test-${Date.now()}`,
        guestName: 'Client Test',
        guestEmail: 'test@email.com',
        guestPhone: '+33 6 12 34 56 78',
        roomName: 'Chambre Test',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        nights: 3,
        amount: 150,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('realBookings') || '[]');
      existing.push(booking);
      localStorage.setItem('realBookings', JSON.stringify(existing));
      
      setBookings(existing);
      setMessage(`✅ Réservation test ajoutée! Total: ${existing.length}`);
    } catch (error) {
      setMessage(`❌ Erreur: ${error}`);
    }
  };

  const clearAll = () => {
    if (confirm('Effacer toutes les réservations?')) {
      localStorage.removeItem('realBookings');
      setBookings([]);
      setMessage('🗑️ Tout effacé');
    }
  };

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">📊 Dashboard Admin - Test</h1>
          
          {/* Contrôles */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Contrôles</h2>
            <div className="flex gap-4 flex-wrap">
              <button 
                onClick={loadBookings}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                🔄 Actualiser
              </button>
              <button 
                onClick={addTestBooking}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                ➕ Ajouter Test
              </button>
              <button 
                onClick={clearAll}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                🗑️ Tout Effacer
              </button>
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <strong>Message:</strong> {message}
            </div>
          </div>

          {/* Réservations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Réservations ({bookings.length})
            </h2>
            
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📅</div>
                <p>Aucune réservation</p>
                <p className="text-sm mt-2">
                  Testez: Allez sur <a href="/booking" className="text-blue-500 underline">/booking</a> 
                  {' '}faites une réservation, puis actualisez cette page.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border-l-4 border-blue-500 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <strong>Client:</strong><br/>
                        {booking.guestName}<br/>
                        <span className="text-sm text-gray-600">{booking.guestEmail}</span><br/>
                        {booking.guestPhone && <span className="text-sm text-gray-600">{booking.guestPhone}</span>}
                      </div>
                      <div>
                        <strong>Chambre:</strong><br/>
                        {booking.roomName}<br/>
                        <span className="text-sm text-gray-600">
                          {new Date(booking.checkIn).toLocaleDateString('fr-FR')} - {new Date(booking.checkOut).toLocaleDateString('fr-FR')}
                        </span><br/>
                        <span className="text-sm text-gray-600">{booking.nights} nuits</span>
                      </div>
                      <div>
                        <strong>Prix & Statut:</strong><br/>
                        <span className="text-lg font-bold">{booking.amount}€</span><br/>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">📋 Comment tester:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Cliquez sur "➕ Ajouter Test" pour vérifier que le système fonctionne</li>
              <li>Allez sur <a href="/booking" className="text-blue-500 underline">/booking</a></li>
              <li>Remplissez le formulaire avec VOS informations réelles</li>
              <li>Cliquez "Continuer vers le paiement"</li>
              <li>Payez (simulation)</li>
              <li>Revenez ici et cliquez "🔄 Actualiser"</li>
              <li>Votre réservation devrait apparaître!</li>
            </ol>
          </div>
        </div>
      </main>
    </AdminProtection>
  );
}
