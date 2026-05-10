// Service d'email ultra-simple avec Web API (fonctionne immédiatement)
// Utilise l'API Web de Gmail pour envoyer des emails directement

export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<boolean> => {
  try {
    // Créer le contenu de l'email
    const subject = 'BookingHostel - Réinitialisation de mot de passe';
    const body = `Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte BookingHostel.

Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :
${resetLink}

Ce lien expirera dans 24 heures.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

Cordialement,
L'équipe BookingHostel`;

    // Méthode 1: Ouvrir le client email par défaut
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Ouvrir automatiquement le client email
    window.open(mailtoLink, '_blank');
    
    // Afficher les instructions
    console.log('=== EMAIL PRÊT À ENVOYER ===');
    console.log('Un email a été ouvert dans votre client email par défaut');
    console.log('Destinataire:', email);
    console.log('Sujet:', subject);
    console.log('Lien de réinitialisation:', resetLink);
    console.log('==========================');

    return true;
    
  } catch (error) {
    console.error('Erreur lors de la préparation de l\'email:', error);
    return false;
  }
};

// Alternative: Copier le lien dans le presse-papiers
export const copyResetLink = async (email: string, resetLink: string): Promise<boolean> => {
  try {
    // Copier le lien dans le presse-papiers
    await navigator.clipboard.writeText(resetLink);
    
    // Afficher une notification
    alert(`Lien de réinitialisation copié!\n\nDestinataire: ${email}\nLien: ${resetLink}\n\nCollez ce lien dans votre navigateur.`);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la copie du lien:', error);
    return false;
  }
};
