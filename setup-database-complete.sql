-- ==========================================
-- COMPLETE DATABASE SETUP SCRIPT
-- EXECUTE THIS SINGLE SCRIPT in Supabase SQL Editor
-- ==========================================

-- STEP 1: CREATE TABLES
-- ==========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night >= 0),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- Room availability table
CREATE TABLE IF NOT EXISTS room_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, date)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: PERFORMANCE INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_room_availability_room_date ON room_availability(room_id, date);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON rooms(available);

-- STEP 3: UTILITY FUNCTIONS
-- ==========================================

-- Function to check room availability
CREATE OR REPLACE FUNCTION check_room_availability(
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE
) RETURNS BOOLEAN AS $$
DECLARE
  conflicting_bookings INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO conflicting_bookings
  FROM bookings
  WHERE room_id = p_room_id
    AND status IN ('pending', 'confirmed')
    AND (
      (check_in_date <= p_check_in AND check_out_date > p_check_in) OR
      (check_in_date < p_check_out AND check_out_date >= p_check_out) OR
      (check_in_date >= p_check_in AND check_out_date <= p_check_out)
    );
  
  RETURN conflicting_bookings = 0;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 4: AUTOMATIC TRIGGERS
-- ==========================================

-- Drop existing triggers to avoid errors
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_room_availability_updated_at ON room_availability;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_availability_updated_at BEFORE UPDATE ON room_availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 5: ENABLE RLS (ROW LEVEL SECURITY)
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- STEP 6: SECURITY POLICIES
-- ==========================================

-- Drop existing policies to avoid errors
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Everyone can view rooms" ON rooms;
DROP POLICY IF EXISTS "Authenticated users can view all rooms" ON rooms;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Everyone can view room availability" ON room_availability;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments for own bookings" ON payments;

-- Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Policies for rooms table
CREATE POLICY "Everyone can view rooms" ON rooms
  FOR SELECT USING (available = true);

CREATE POLICY "Authenticated users can view all rooms" ON rooms
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for bookings table
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Policies for room_availability table
CREATE POLICY "Everyone can view room availability" ON room_availability
  FOR SELECT USING (true);

-- Policies for payments table
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can create payments for own bookings" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id::text = auth.uid()::text
    )
  );

-- STEP 7: ADMIN FUNCTIONS
-- ==========================================

-- Utility function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- TODO: Change 'admin@your-hostel.com' to your admin email
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = user_id 
    AND users.email = 'admin@your-hostel.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage rooms" ON rooms;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage rooms" ON rooms
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (is_admin(auth.uid()));

-- STEP 8: TEST DATA (OPTIONAL)
-- ==========================================

-- Insert some test rooms
INSERT INTO rooms (name, description, capacity, price_per_night, available) VALUES
('Single Room', 'Comfortable room for one person', 1, 45.00, true),
('Double Room', 'Spacious room for two people', 2, 75.00, true),
('Deluxe Suite', 'Luxury suite with city view', 4, 150.00, true),
('Family Room', 'Perfect room for families with children', 6, 120.00, true)
ON CONFLICT DO NOTHING;

-- ==========================================
-- INSTALLATION COMPLETE!
-- Your database is ready to use
-- ==========================================
