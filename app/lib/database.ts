import { supabase } from './supabase';
import { User, Room, Booking, Payment, RoomAvailability, CreateBookingData, CreateUserData, CreatePaymentData, CreateRoomAvailabilityData, CreateRoomData, Feedback, CreateFeedbackData } from '../types/database';

// Users functions
export const createUser = async (userData: CreateUserData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  return { data, error };
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  return { data, error };
};

// Rooms functions
export const getAvailableRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('available', true)
    .order('price_per_night');
  
  return { data, error };
};

export const getRoomById = async (roomId: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();
  
  return { data, error };
};

export const createRoom = async (roomData: CreateRoomData) => {
  const { data, error } = await supabase
    .from('rooms')
    .insert([roomData])
    .select()
    .single();
  
  return { data, error };
};

export const updateRoom = async (roomId: string, roomData: Partial<CreateRoomData>) => {
  const { data, error } = await supabase
    .from('rooms')
    .update(roomData)
    .eq('id', roomId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteRoom = async (roomId: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId);
  
  return { data, error };
};

export const checkRoomAvailability = async (
  roomId: string, 
  checkIn: string, 
  checkOut: string
) => {
  const { data, error } = await supabase
    .rpc('check_room_availability', {
      p_room_id: roomId,
      p_check_in: checkIn,
      p_check_out: checkOut
    });
  
  return { data, error };
};

// Bookings functions
export const createBooking = async (bookingData: CreateBookingData, userId: string) => {
  // Calculate total price based on room price and nights
  const room = await getRoomById(bookingData.room_id);
  if (room.error || !room.data) {
    return { data: null, error: room.error || 'Room not found' };
  }

  const checkIn = new Date(bookingData.check_in_date);
  const checkOut = new Date(bookingData.check_out_date);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = room.data.price_per_night * nights;

  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      ...bookingData,
      user_id: userId,
      total_price: totalPrice
    }])
    .select(`
      *,
      room:rooms(*),
      user:users(*)
    `)
    .single();
  
  return { data, error };
};

export const getUserBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      room:rooms(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getAllBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      room:rooms(*),
      user:users(*)
    `)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single();
  
  return { data, error };
};

// Search rooms with filters
export const searchRooms = async (filters: {
  check_in_date?: string;
  check_out_date?: string;
  capacity?: number;
  max_price?: number;
}) => {
  let query = supabase
    .from('rooms')
    .select('*')
    .eq('available', true);

  if (filters.capacity) {
    query = query.gte('capacity', filters.capacity);
  }

  if (filters.max_price) {
    query = query.lte('price_per_night', filters.max_price);
  }

  const { data, error } = await query.order('price_per_night');
  
  return { data, error };
};

// Dashboard statistics
export const getDashboardStats = async () => {
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('total_price, status');

  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('available');

  if (bookingsError || roomsError) {
    return { data: null, error: bookingsError || roomsError };
  }

  const totalBookings = bookings?.length || 0;
  const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;
  const occupiedRooms = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const availableRooms = rooms?.filter(r => r.available).length || 0;
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;

  const stats = {
    total_bookings: totalBookings,
    total_revenue: totalRevenue,
    occupied_rooms: occupiedRooms,
    available_rooms: availableRooms,
    pending_bookings: pendingBookings
  };

  return { data: stats, error: null };
};

// Payments functions
export const createPayment = async (paymentData: CreatePaymentData) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select(`
      *,
      booking:bookings(*, room:rooms(*), user:users(*))
    `)
    .single();
  
  return { data, error };
};

export const getPaymentsByBookingId = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const updatePaymentStatus = async (paymentId: string, status: 'pending' | 'completed' | 'failed') => {
  const { data, error } = await supabase
    .from('payments')
    .update({ payment_status: status })
    .eq('id', paymentId)
    .select()
    .single();
  
  return { data, error };
};

export const getUserPayments = async (userId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      booking:bookings(*, room:rooms(*))
    `)
    .eq('booking.user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getAllPayments = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      booking:bookings(*, room:rooms(*), user:users(*))
    `)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Room Availability functions
export const createRoomAvailability = async (availabilityData: CreateRoomAvailabilityData) => {
  const { data, error } = await supabase
    .from('room_availability')
    .insert([availabilityData])
    .select(`
      *,
      room:rooms(*)
    `)
    .single();
  
  return { data, error };
};

export const getRoomAvailability = async (roomId: string, startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('room_availability')
    .select('*')
    .eq('room_id', roomId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date');
  
  return { data, error };
};

export const updateRoomAvailability = async (roomId: string, date: string, isAvailable: boolean) => {
  const { data, error } = await supabase
    .from('room_availability')
    .upsert({
      room_id: roomId,
      date: date,
      is_available: isAvailable
    })
    .select()
    .single();
  
  return { data, error };
};

export const getAvailableRoomsForDates = async (checkIn: string, checkOut: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('available', true)
    .not('id', 'in', 
      `(SELECT DISTINCT room_id FROM bookings 
        WHERE status IN ('pending', 'confirmed') 
        AND (
          (check_in_date <= '${checkIn}' AND check_out_date > '${checkIn}') OR
          (check_in_date < '${checkOut}' AND check_out_date >= '${checkOut}') OR
          (check_in_date >= '${checkIn}' AND check_out_date <= '${checkOut}')
        ))`
    )
    .order('price_per_night');
  
  return { data, error };
};

export const setRoomAvailabilityForBooking = async (roomId: string, checkIn: string, checkOut: string, isAvailable: boolean) => {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const dates = [];
  
  for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
    dates.push(date.toISOString().split('T')[0]);
  }
  
  const availabilityData = dates.map(date => ({
    room_id: roomId,
    date: date,
    is_available: isAvailable
  }));
  
  const { data, error } = await supabase
    .from('room_availability')
    .upsert(availabilityData)
    .select();
  
  return { data, error };
};

// Feedback functions
export const createFeedback = async (feedbackData: CreateFeedbackData) => {
  const { data, error } = await supabase
    .from('feedbacks')
    .insert([feedbackData])
    .select()
    .single();
  
  return { data, error };
};

export const getFeedbacks = async (roomId?: string, limit: number = 50) => {
  let query = supabase
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (roomId) {
    query = query.eq('room_id', roomId);
  }
  
  const { data, error } = await query;
  
  return { data, error };
};

export const getFeedbackById = async (feedbackId: string) => {
  const { data, error } = await supabase
    .from('feedbacks')
    .select('*')
    .eq('id', feedbackId)
    .single();
  
  return { data, error };
};

export const updateFeedback = async (feedbackId: string, feedbackData: Partial<CreateFeedbackData>) => {
  const { data, error } = await supabase
    .from('feedbacks')
    .update(feedbackData)
    .eq('id', feedbackId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteFeedback = async (feedbackId: string) => {
  const { data, error } = await supabase
    .from('feedbacks')
    .delete()
    .eq('id', feedbackId);
  
  return { data, error };
};

export const getAverageRating = async (roomId?: string) => {
  let query = supabase
    .from('feedbacks')
    .select('rating');
  
  if (roomId) {
    query = query.eq('room_id', roomId);
  }
  
  const { data, error } = await query;
  
  if (error || !data || data.length === 0) {
    return { data: 0, error };
  }
  
  const sum = data.reduce((acc, f) => acc + f.rating, 0);
  const average = sum / data.length;
  
  return { data: average, error: null };
};
