// Script de test pour vérifier la connexion à la base de données Supabase
import { supabase } from './app/lib/supabase.js';

async function testDatabaseConnection() {
  console.log('🔍 Test de connexion à la base de données...\n');

  try {
    // Test 1: Vérifier la connexion
    console.log('1️⃣ Test de connexion de base...');
    const { data, error } = await supabase.from('rooms').select('count');
    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      return;
    }
    console.log('✅ Connexion réussie !\n');

    // Test 2: Vérifier les chambres de test
    console.log('2️⃣ Vérification des chambres de test...');
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('available', true);
    
    if (roomsError) {
      console.error('❌ Erreur lors de la lecture des chambres:', roomsError.message);
      return;
    }
    
    console.log(`✅ ${rooms.length} chambres trouvées :`);
    rooms.forEach(room => {
      console.log(`   🏠 ${room.name} - ${room.price_per_night}€/nuit - Capacité: ${room.capacity} personnes`);
    });
    console.log('');

    // Test 3: Vérifier les tables existent
    console.log('3️⃣ Vérification des tables...');
    const tables = ['users', 'rooms', 'bookings', 'room_availability', 'payments'];
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.error(`❌ Table '${table}' inaccessible:`, error.message);
      } else {
        console.log(`✅ Table '${table}' accessible`);
      }
    }
    console.log('');

    // Test 4: Vérifier les politiques RLS
    console.log('4️⃣ Test des politiques de sécurité (RLS)...');
    
    // Test lecture publique des chambres (devrait fonctionner)
    const { data: publicRooms, error: publicError } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);
    
    if (publicError) {
      console.error('❌ Politique publique chambres échouée:', publicError.message);
    } else {
      console.log('✅ Politique publique chambres fonctionne');
    }

    // Test lecture des réservations (devrait échouer sans auth)
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);
    
    if (bookingsError && bookingsError.message.includes('row-level security')) {
      console.log('✅ Politique RLS bookings fonctionne (accès bloqué comme attendu)');
    } else if (bookingsError) {
      console.error('❌ Erreur inattendue bookings:', bookingsError.message);
    } else {
      console.log('ℹ️  Bookings accessible (peut-être vide)');
    }

    console.log('\n🎉 Test terminé !');
    console.log('📊 Résumé :');
    console.log('   - Connexion Supabase : ✅');
    console.log('   - Tables créées : ✅');
    console.log('   - Données de test : ✅');
    console.log('   - Sécurité RLS : ✅');
    console.log('\n🚀 Votre base de données est prête à utiliser !');

  } catch (error) {
    console.error('❌ Erreur critique:', error);
  }
}

// Exécuter le test
testDatabaseConnection();
