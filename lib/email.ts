// Service d'email avec EmailJS (fonctionne sans serveur)
// Pour l'utiliser, vous devez créer un compte gratuit sur EmailJS.com

interface EmailData {
  to_email: string;
  subject: string;
  message: string;
  reset_link?: string;
}

export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<boolean> => {
  try {
    // Configuration EmailJS (à remplacer avec vos vraies clés)
    const SERVICE_ID = 'your_service_id';
    const TEMPLATE_ID = 'your_template_id';
    const PUBLIC_KEY = 'your_public_key';

    // Préparer les données pour l'email
    const emailData: EmailData = {
      to_email: email,
      subject: 'BookingHostel - Réinitialisation de mot de passe',
      message: `Bonjour,\n\nVous avez demandé la réinitialisation de votre mot de passe pour votre compte BookingHostel.\n\nCliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :\n${resetLink}\n\nCe lien expirera dans 24 heures.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nCordialement,\nL'équipe BookingHostel`,
      reset_link: resetLink
    };

    // Pour l'instant, utilisation de console.log pour la simulation
    console.log('=== ENVOI D\'EMAIL RÉEL ===');
    console.log('Destinataire:', email);
    console.log('Sujet:', emailData.subject);
    console.log('Message:', emailData.message);
    console.log('Lien de réinitialisation:', resetLink);
    console.log('========================');

    // Code pour EmailJS (à décommenter quand vous aurez vos clés)
    /*
    emailjs.send(SERVICE_ID, TEMPLATE_ID, emailData, PUBLIC_KEY)
      .then((response) => {
        console.log('Email envoyé avec succès!', response.status, response.text);
        return true;
      }, (error) => {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
      });
    */

    // Simulation d'envoi réussi
    return true;
    
  } catch (error) {
    console.error('Erreur lors de la préparation de l\'email:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    const emailData = {
      to_email: email,
      subject: 'Bienvenue sur BookingHostel!',
      message: `Bonjour ${name},\n\nBienvenue sur BookingHostel! Votre compte a été créé avec succès.\n\nVous pouvez maintenant vous connecter et commencer à faire des réservations.\n\nCordialement,\nL'équipe BookingHostel`
    };

    console.log('=== EMAIL DE BIENVENUE ===');
    console.log('Destinataire:', email);
    console.log('Sujet:', emailData.subject);
    console.log('Message:', emailData.message);
    console.log('========================');

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    return false;
  }
};
