-- Politiques de sécurité RLS (Row Level Security) pour l'auberge

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table users
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Les utilisateurs peuvent insérer leur propre profil (inscription)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Politiques pour la table rooms (lecture publique pour tous)
-- Tout le monde peut voir les chambres disponibles
CREATE POLICY "Everyone can view rooms" ON rooms
  FOR SELECT USING (available = true);

-- Seuls les administrateurs peuvent modifier les chambres (à adapter selon votre système d'admin)
CREATE POLICY "Authenticated users can view all rooms" ON rooms
  FOR SELECT USING (auth.role() = 'authenticated');

-- Politiques pour la table bookings
-- Les utilisateurs peuvent voir leurs propres réservations
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Les utilisateurs peuvent créer leurs propres réservations
CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Les utilisateurs peuvent mettre à jour leurs propres réservations
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Politiques pour la table room_availability
-- Tout le monde peut voir les disponibilités
CREATE POLICY "Everyone can view room availability" ON room_availability
  FOR SELECT USING (true);

-- Politiques pour la table payments
-- Les utilisateurs peuvent voir leurs propres paiements
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id::text = auth.uid()::text
    )
  );

-- Les utilisateurs peuvent créer des paiements pour leurs réservations
CREATE POLICY "Users can create payments for own bookings" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id::text = auth.uid()::text
    )
  );

-- Fonction utilitaire pour vérifier si un utilisateur est administrateur
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- À adapter selon votre logique d'administration
  -- Par exemple, vérifier si l'email est dans une table admins
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = user_id 
    AND users.email = 'admin@votre-auberge.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Politiques d'administrateur (optionnel)
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
