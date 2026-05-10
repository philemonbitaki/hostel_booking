-- FIX RLS POLICIES FOR USER REGISTRATION
-- This script will fix the row-level security policies to allow user registration

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new, more permissive policies for users table
CREATE POLICY "Allow public user registration" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Also fix rooms policies to ensure they work
DROP POLICY IF EXISTS "Everyone can view rooms" ON rooms;
DROP POLICY IF EXISTS "Authenticated users can view all rooms" ON rooms;

CREATE POLICY "Everyone can view rooms" ON rooms
  FOR SELECT USING (true);

-- Fix bookings policies  
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Fix room availability policies
DROP POLICY IF EXISTS "Everyone can view room availability" ON room_availability;

CREATE POLICY "Everyone can view room availability" ON room_availability
  FOR SELECT USING (true);

-- Fix payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments for own bookings" ON payments;

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can create payments for own bookings" ON payments
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id::text = auth.uid()::text
    )
  );

SELECT '✅ RLS policies fixed for user registration!' as result;
