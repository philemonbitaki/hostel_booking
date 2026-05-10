-- Script de vérification rapide de l'installation
-- Exécuter dans Supabase SQL Editor après l'installation

-- Vérifier les tables
SELECT 'Tables créées :' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'rooms', 'bookings', 'room_availability', 'payments')
ORDER BY table_name;

-- Vérifier les chambres de test
SELECT '';
SELECT 'Chambres de test :' as info;
SELECT name, capacity, price_per_night, available 
FROM rooms 
ORDER BY name;

-- Vérifier les politiques RLS
SELECT '';
SELECT 'Politiques RLS actives :' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
ORDER BY tablename;

-- Vérifier les fonctions créées
SELECT '';
SELECT 'Fonctions créées :' as info;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('check_room_availability', 'update_updated_at_column', 'is_admin')
ORDER BY routine_name;

-- Compter les enregistrements
SELECT '';
SELECT 'Statistiques des tables :' as info;
SELECT 
  'users' as table_name, (SELECT COUNT(*) FROM users) as record_count
UNION ALL
SELECT 
  'rooms' as table_name, (SELECT COUNT(*) FROM rooms) as record_count  
UNION ALL
SELECT 
  'bookings' as table_name, (SELECT COUNT(*) FROM bookings) as record_count
UNION ALL
SELECT 
  'room_availability' as table_name, (SELECT COUNT(*) FROM room_availability) as record_count
UNION ALL
SELECT 
  'payments' as table_name, (SELECT COUNT(*) FROM payments) as record_count;

SELECT '';
SELECT '✅ Vérification terminée !' as result;
