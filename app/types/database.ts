// Types TypeScript pour la base de données de l'auberge

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  price_per_night: number;
  image_url?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface RoomAvailability {
  id: string;
  room_id: string;
  date: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

// Types étendus avec relations
export interface BookingWithDetails extends Booking {
  user?: User;
  room?: Room;
  payments?: Payment[];
}

export interface RoomWithBookings extends Room {
  bookings?: Booking[];
}

// Types pour les formulaires
export interface CreateBookingData {
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  special_requests?: string;
}

export interface CreateUserData {
  email: string;
  full_name?: string;
  phone?: string;
}

export interface CreateRoomData {
  name: string;
  description?: string;
  capacity: number;
  price_per_night: number;
  image_url?: string;
}

export interface CreatePaymentData {
  booking_id: string;
  amount: number;
  payment_method: string;
  payment_status?: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
}

export interface CreateRoomAvailabilityData {
  room_id: string;
  date: string;
  is_available: boolean;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface BookingSearchFilters {
  check_in_date?: string;
  check_out_date?: string;
  capacity?: number;
  max_price?: number;
}

// Types pour le tableau de bord
export interface DashboardStats {
  total_bookings: number;
  total_revenue: number;
  occupied_rooms: number;
  available_rooms: number;
  pending_bookings: number;
}

// Types pour les avis clients
export interface Feedback {
  id: string;
  user_id?: string;
  room_id?: string;
  booking_id?: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackData {
  user_id?: string;
  room_id?: string;
  booking_id?: string;
  rating: number;
  comment: string;
}
