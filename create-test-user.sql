-- CREATE A TEST USER FOR BOOKINGS
-- This will create a test user that can be used for bookings

INSERT INTO users (id, email, full_name, phone) VALUES 
('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User', '+1234567890')
ON CONFLICT (id) DO NOTHING;

SELECT '✅ Test user created for bookings!' as result;
