'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminProtection from '../components/AdminProtection';
import { getBookings, getBookingStats, getUniqueClients, updateBookingStatus } from '../../../lib/real-bookings';

export default function RealBookingsDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'stats'>('bookings');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const allBookings = getBookings();
      const uniqueClients = getUniqueClients();
      const stats = getBookingStats();
      
      setBookings(allBookings);
      setClients(uniqueClients);
      console.log('Réservations chargées:', allBookings);
      console.log('Clients uniques:', uniqueClients);
      console.log('Statistiques:', stats);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      const success = updateBookingStatus(bookingId, 'cancelled');
      if (success) {
        loadData(); // Recharger les données
        alert('Réservation annulée avec succès');
      } else {
        alert('Erreur lors de l\'annulation de la réservation');
      }
    }
  };

  const stats = getBookingStats();

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Admin</h1>
                <p className="text-sm text-gray-500">Réservations réelles des clients</p>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={loadData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔄 Actualiser
                </button>
                <Link href="/admin/rooms" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  🏠 Chambres
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📅 Réservations ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Statistiques
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Chargement des données...</p>
            </div>
          ) : (
            <>
              {/* Message si aucune réservation */}
              {bookings.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-800">
                      Aucune réservation pour le moment. Les réservations apparaîtront ici lorsque les clients commenceront à réserver.
                    </span>
                  </div>
                </div>
              )}

              {/* Onglet Réservations */}
              {activeTab === 'bookings' && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Réservations des Clients
                    </h3>
                    {bookings.length > 0 ? (
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Booking ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Client
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chambre
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dates
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prix Total
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                  {booking.id.substring(0, 8)}...
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
                                  <div className="font-medium">{booking.roomName.split(' - ')[0]}</div>
                                  <div className="text-xs text-gray-400">
                                    {booking.nights} nuits • {booking.amount / booking.nights}€/nuit
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div>{new Date(booking.checkIn).toLocaleDateString('fr-FR')}</div>
                                  <div className="text-xs">au {new Date(booking.checkOut).toLocaleDateString('fr-FR')}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {booking.amount}€
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    booking.status === 'confirmed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {booking.status === 'confirmed' ? 'confirmed' : 'cancelled'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {booking.status === 'confirmed' && (
                                    <button 
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📅</div>
                        <p>Aucune réservation trouvée</p>
                        <p className="text-sm">Les réservations apparaîtront ici lorsque les clients effectueront des réservations</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Onglet Statistiques */}
              {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <span className="text-white text-2xl">👥</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Clients Uniques
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {clients.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <span className="text-white text-2xl">📅</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Réservations
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.total}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <span className="text-white text-2xl">✅</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Réservations Confirmées
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.confirmed}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                        <span className="text-white text-2xl">❌</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Réservations Annulées
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.cancelled}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <span className="text-white text-2xl">💰</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Revenu Total
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.totalRevenue}€
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                        <span className="text-white text-2xl">📊</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Taux de Confirmation
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.confirmationRate}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </AdminProtection>
  );
}
