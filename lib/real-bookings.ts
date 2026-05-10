// Système de sauvegarde des vraies réservations clients

export interface RealBooking {
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

// Sauvegarder une réservation dans localStorage
export const saveBooking = (bookingData: Omit<RealBooking, 'id' | 'status' | 'createdAt'>): RealBooking => {
  const newBooking: RealBooking = {
    ...bookingData,
    id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  // Récupérer les réservations existantes
  const existingBookings = getBookings();
  existingBookings.push(newBooking);
  
  // Sauvegarder dans localStorage
  localStorage.setItem('realBookings', JSON.stringify(existingBookings));
  
  return newBooking;
};

// Récupérer toutes les réservations
export const getBookings = (): RealBooking[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('realBookings');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Récupérer une réservation par ID
export const getBookingById = (id: string): RealBooking | undefined => {
  const bookings = getBookings();
  return bookings.find(booking => booking.id === id);
};

// Mettre à jour le statut d'une réservation
export const updateBookingStatus = (id: string, status: 'confirmed' | 'cancelled'): boolean => {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === id);
  
  if (booking) {
    booking.status = status;
    localStorage.setItem('realBookings', JSON.stringify(bookings));
    return true;
  }
  return false;
};

// Supprimer une réservation
export const deleteBooking = (id: string): boolean => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  
  if (index !== -1) {
    bookings.splice(index, 1);
    localStorage.setItem('realBookings', JSON.stringify(bookings));
    return true;
  }
  return false;
};

// Obtenir les statistiques des réservations
export const getBookingStats = () => {
  const bookings = getBookings();
  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.amount, 0);
  
  return {
    total,
    confirmed,
    cancelled,
    totalRevenue,
    confirmationRate: total > 0 ? Math.round((confirmed / total) * 100) : 0
  };
};

// Obtenir les clients uniques
export const getUniqueClients = () => {
  const bookings = getBookings();
  const uniqueClients = new Map<string, { name: string; email: string; phone?: string; firstBooking: string }>();
  
  bookings.forEach(booking => {
    if (!uniqueClients.has(booking.guestEmail)) {
      uniqueClients.set(booking.guestEmail, {
        name: booking.guestName,
        email: booking.guestEmail,
        phone: booking.guestPhone,
        firstBooking: booking.createdAt
      });
    }
  });
  
  return Array.from(uniqueClients.values());
};
