'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminProtection from '../components/AdminProtection';

// Données directement dans le fichier pour éviter les erreurs d'import
const mockBookings = [
  {
    id: 'be985b52-1234-5678-9abc-123456789001',
    guestName: 'Marie Dubois',
    guestEmail: 'marie.dubois@email.com',
    guestPhone: '+33 6 12 34 56 78',
    roomName: 'Chambre Simple - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-08',
    nights: 8,
    amount: 360,
    status: 'confirmed',
    createdAt: '2026-04-25T10:00:00Z'
  },
  {
    id: '193f2e11-1234-5678-9abc-123456789002',
    guestName: 'Jean Martin',
    guestEmail: 'jean.martin@email.com',
    guestPhone: '+33 6 23 45 67 89',
    roomName: 'Chambre Simple - University Hostel',
    checkIn: '2026-05-07',
    checkOut: '2026-05-16',
    nights: 9,
    amount: 405,
    status: 'cancelled',
    createdAt: '2026-04-26T10:00:00Z'
  },
  {
    id: 'b4afa924-1234-5678-9abc-123456789003',
    guestName: 'Sophie Bernard',
    guestEmail: 'sophie.bernard@email.com',
    guestPhone: '+33 6 34 56 78 90',
    roomName: 'Suite Deluxe - Private Hostel',
    checkIn: '2026-05-09',
    checkOut: '2026-05-20',
    nights: 11,
    amount: 495,
    status: 'confirmed',
    createdAt: '2026-04-27T10:00:00Z'
  },
  {
    id: 'c271bd25-1234-5678-9abc-123456789004',
    guestName: 'Pierre Leroy',
    guestEmail: 'pierre.leroy@email.com',
    guestPhone: '+33 6 45 67 89 01',
    roomName: 'Suite Deluxe - Private Hostel',
    checkIn: '2026-05-08',
    checkOut: '2026-05-23',
    nights: 15,
    amount: 2250,
    status: 'confirmed',
    createdAt: '2026-04-28T10:00:00Z'
  },
  {
    id: '3e173aec-1234-5678-9abc-123456789005',
    guestName: 'Claire Petit',
    guestEmail: 'claire.petit@email.com',
    guestPhone: '+33 6 56 78 90 12',
    roomName: 'Chambre Simple - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-06',
    nights: 6,
    amount: 270,
    status: 'confirmed',
    createdAt: '2026-04-29T10:00:00Z'
  },
  {
    id: 'f41eba4c-1234-5678-9abc-123456789006',
    guestName: 'Lucas Robert',
    guestEmail: 'lucas.robert@email.com',
    guestPhone: '+33 6 67 89 01 23',
    roomName: 'Chambre Simple - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-07',
    nights: 7,
    amount: 315,
    status: 'cancelled',
    createdAt: '2026-04-30T10:00:00Z'
  },
  {
    id: '0a65eff6-1234-5678-9abc-123456789007',
    guestName: 'Emma Moreau',
    guestEmail: 'emma.moreau@email.com',
    guestPhone: '+33 6 78 90 12 34',
    roomName: 'Chambre Double - Private Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-09',
    nights: 9,
    amount: 405,
    status: 'confirmed',
    createdAt: '2026-05-01T10:00:00Z'
  }
];

export default function SimpleAdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'stats'>('bookings');

  // Calculer les statistiques
  const stats = {
    total: mockBookings.length,
    confirmed: mockBookings.filter(b => b.status === 'confirmed').length,
    cancelled: mockBookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: mockBookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.amount, 0),
    confirmationRate: Math.round((mockBookings.filter(b => b.status === 'confirmed').length / mockBookings.length) * 100)
  };

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Admin</h1>
                <p className="text-sm text-gray-500">Gérez vos réservations et clients</p>
              </div>
              <div className="flex space-x-4">
                <Link href="/admin/rooms" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  🏠 Gérer les Chambres
                </Link>
                <Link href="/admin" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  ⚙️ Paramètres
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
                📅 Réservations ({mockBookings.length})
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
              {/* Onglet Réservations */}
              {activeTab === 'bookings' && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Réservations des Clients
                    </h3>
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
                          {mockBookings.map((booking) => (
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
                                  <button className="text-red-600 hover:text-red-900">
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Statistiques */}
              {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
