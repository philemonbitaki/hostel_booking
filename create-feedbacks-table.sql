-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedbacks_room_id ON feedbacks(room_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Policies for feedbacks table
-- Everyone can view feedbacks
CREATE POLICY "Everyone can view feedbacks" ON feedbacks
  FOR SELECT
  USING (true);

-- Authenticated users can create feedbacks
CREATE POLICY "Authenticated users can create feedbacks" ON feedbacks
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Users can update their own feedbacks
CREATE POLICY "Users can update own feedbacks" ON feedbacks
  FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Users can delete their own feedbacks
CREATE POLICY "Users can delete own feedbacks" ON feedbacks
  FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feedbacks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_feedbacks_updated_at ON feedbacks;
CREATE TRIGGER update_feedbacks_updated_at
  BEFORE UPDATE ON feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION update_feedbacks_updated_at();

SELECT '✅ Feedbacks table created successfully!' as result;
