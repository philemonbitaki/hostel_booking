'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminProtection from '../components/AdminProtection';

export default function WorkingAdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    try {
      // Récupérer les réservations depuis localStorage
      const stored = localStorage.getItem('realBookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setBookings(parsed);
        console.log('Réservations trouvées:', parsed);
      } else {
        console.log('Aucune réservation trouvée');
        setBookings([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const clearBookings = () => {
    if (confirm('Voulez-vous effacer toutes les réservations ?')) {
      localStorage.removeItem('realBookings');
      setBookings([]);
    }
  };

  const addTestBooking = () => {
    const testBooking = {
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
    existing.push(testBooking);
    localStorage.setItem('realBookings', JSON.stringify(existing));
    loadBookings();
  };

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin - Réservations Réelles</h1>
                <p className="text-sm text-gray-500">Voir les vraies réservations des clients</p>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={loadBookings}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  🔄 Actualiser
                </button>
                <button 
                  onClick={addTestBooking}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  ➕ Ajouter Test
                </button>
                <button 
                  onClick={clearBookings}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  🗑️ Tout Effacer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Réservations ({bookings.length})
                </h3>

                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
                    <p className="text-gray-500 mb-4">
                      Les réservations apparaîtront ici lorsque les clients feront des réservations.
                    </p>
                    <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">Pour tester :</p>
                      <p>1. Allez sur <a href="/booking" className="text-blue-600 hover:underline">/booking</a></p>
                      <p>2. Faites une réservation avec vos infos</p>
                      <p>3. Payez (simulation)</p>
                      <p>4. Revenez ici et cliquez "🔄 Actualiser"</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Chambre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Dates
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Prix
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                              {booking.id.substring(0, 12)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.guestName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.guestEmail}
                              </div>
                              {booking.guestPhone && (
                                <div className="text-xs text-gray-400">
                                  {booking.guestPhone}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.roomName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>{new Date(booking.checkIn).toLocaleDateString('fr-FR')}</div>
                              <div className="text-xs">au {new Date(booking.checkOut).toLocaleDateString('fr-FR')}</div>
                              <div className="text-xs text-gray-400">{booking.nights} nuits</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {booking.amount}€
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📋 Comment ça marche :</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Un client va sur <a href="/booking" className="underline">/booking</a> et remplit le formulaire</li>
              <li>Il entre son vrai nom, email, téléphone</li>
              <li>Il choisit ses dates et sa chambre</li>
              <li>Il paie (simulation)</li>
              <li>La réservation est automatiquement sauvegardée</li>
              <li>Vous la voyez ici en cliquant "🔄 Actualiser"</li>
            </ol>
          </div>
        </div>
      </main>
    </AdminProtection>
  );
}
