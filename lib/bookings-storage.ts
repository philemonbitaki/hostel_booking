// Système de stockage des réservations avec informations clients

export interface BookingWithGuest {
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

// Simuler une base de données de réservations
let bookings: BookingWithGuest[] = [
  {
    id: 'be985b52-1234-5678-9abc-123456789001',
    guestName: 'Marie Dubois',
    guestEmail: 'marie.dubois@email.com',
    guestPhone: '+33 6 12 34 56 78',
    roomId: '1',
    roomName: 'Chambre Simple - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-08',
    nights: 8,
    amount: 360,
    specialRequests: 'Chambre calme, étage élevé',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    createdAt: new Date('2026-04-25').toISOString()
  },
  {
    id: '193f2e11-1234-5678-9abc-123456789002',
    guestName: 'Jean Martin',
    guestEmail: 'jean.martin@email.com',
    guestPhone: '+33 6 23 45 67 89',
    roomId: '1',
    roomName: 'Chambre Simple - University Hostel',
    checkIn: '2026-05-07',
    checkOut: '2026-05-16',
    nights: 9,
    amount: 405,
    specialRequests: '',
    paymentMethod: 'paypal',
    status: 'cancelled',
    createdAt: new Date('2026-04-26').toISOString()
  },
  {
    id: 'b4afa924-1234-5678-9abc-123456789003',
    guestName: 'Sophie Bernard',
    guestEmail: 'sophie.bernard@email.com',
    guestPhone: '+33 6 34 56 78 90',
    roomId: '3',
    roomName: 'Suite Deluxe - Private Hostel',
    checkIn: '2026-05-09',
    checkOut: '2026-05-20',
    nights: 11,
    amount: 495,
    specialRequests: 'Vue sur la ville',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    createdAt: new Date('2026-04-27').toISOString()
  },
  {
    id: 'c271bd25-1234-5678-9abc-123456789004',
    guestName: 'Pierre Leroy',
    guestEmail: 'pierre.leroy@email.com',
    guestPhone: '+33 6 45 67 89 01',
    roomId: '3',
    roomName: 'Suite Deluxe - Private Hostel',
    checkIn: '2026-05-08',
    checkOut: '2026-05-23',
    nights: 15,
    amount: 2250,
    specialRequests: 'Kitchenette équipée',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    createdAt: new Date('2026-04-28').toISOString()
  },
  {
    id: '3e173aec-1234-5678-9abc-123456789005',
    guestName: 'Claire Petit',
    guestEmail: 'claire.petit@email.com',
    guestPhone: '+33 6 56 78 90 12',
    roomId: '1',
    roomName: 'Chambre Simple - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-06',
    nights: 6,
    amount: 270,
    specialRequests: '',
    paymentMethod: 'bank_transfer',
    status: 'confirmed',
    createdAt: new Date('2026-04-29').toISOString()
  },
  {
    id: 'f41eba4c-1234-5678-9abc-123456789006',
    guestName: 'Lucas Robert',
    guestEmail: 'lucas.robert@email.com',
    guestPhone: '+33 6 67 89 01 23',
    roomId: '1',
    roomName: 'Chambre Simple - University Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-07',
    nights: 7,
    amount: 315,
    specialRequests: 'Proche des transports',
    paymentMethod: 'credit_card',
    status: 'cancelled',
    createdAt: new Date('2026-04-30').toISOString()
  },
  {
    id: '0a65eff6-1234-5678-9abc-123456789007',
    guestName: 'Emma Moreau',
    guestEmail: 'emma.moreau@email.com',
    guestPhone: '+33 6 78 90 12 34',
    roomId: '2',
    roomName: 'Chambre Double - Private Hostel',
    checkIn: '2026-04-30',
    checkOut: '2026-05-09',
    nights: 9,
    amount: 405,
    specialRequests: 'Salle de bain privative',
    paymentMethod: 'paypal',
    status: 'confirmed',
    createdAt: new Date('2026-05-01').toISOString()
  }
];

// Fonctions pour gérer les réservations
export const getAllBookings = (): BookingWithGuest[] => {
  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getBookingById = (id: string): BookingWithGuest | undefined => {
  return bookings.find(booking => booking.id === id);
};

export const createBooking = (bookingData: Omit<BookingWithGuest, 'id' | 'status' | 'createdAt'>): BookingWithGuest => {
  const newBooking: BookingWithGuest = {
    ...bookingData,
    id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  bookings.push(newBooking);
  return newBooking;
};

export const updateBookingStatus = (id: string, status: 'confirmed' | 'cancelled'): boolean => {
  const booking = bookings.find(b => b.id === id);
  if (booking) {
    booking.status = status;
    return true;
  }
  return false;
};

export const deleteBooking = (id: string): boolean => {
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings.splice(index, 1);
    return true;
  }
  return false;
};

export const getBookingStats = () => {
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
