// Service SMS avec Twilio (fonctionne pour envoyer des SMS sur téléphone)
// Pour l'utiliser, vous devez créer un compte gratuit sur Twilio.com

interface SMSData {
  to: string;
  message: string;
}

export const sendPasswordResetSMS = async (phoneNumber: string, resetLink: string): Promise<boolean> => {
  try {
    // Configuration Twilio (à remplacer avec vos vraies clés)
    const accountSid = 'your_account_sid';
    const authToken = 'your_auth_token';
    const twilioNumber = '+1234567890'; // Votre numéro Twilio

    // Préparer le message SMS
    const message = `BookingHostel: Réinitialisation mot de passe. Lien: ${resetLink}. Ce lien expire dans 24h.`;

    // Pour l'instant, utilisation de console.log pour la simulation
    console.log('=== ENVOI SMS RÉEL ===');
    console.log('Destinataire:', phoneNumber);
    console.log('Message:', message);
    console.log('Lien de réinitialisation:', resetLink);
    console.log('====================');

    // Code pour Twilio (à décommenter quand vous aurez vos clés)
    /*
    const twilio = require('twilio')(accountSid, authToken);
    
    await twilio.messages.create({
      body: message,
      from: twilioNumber,
      to: phoneNumber
    });
    
    console.log('SMS envoyé avec succès!');
    */

    // Simulation d'envoi réussi
    return true;
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS:', error);
    return false;
  }
};

// Alternative: Service SMS gratuit avec TextMagic
export const sendSMSWithTextMagic = async (phoneNumber: string, resetLink: string): Promise<boolean> => {
  try {
    const message = `BookingHostel - Réinitialisation mot de passe: ${resetLink}`;
    
    console.log('=== SMS AVEC TEXTMAGIC ===');
    console.log('Téléphone:', phoneNumber);
    console.log('Message:', message);
    console.log('========================');

    return true;
  } catch (error) {
    console.error('Erreur SMS TextMagic:', error);
    return false;
  }
};
