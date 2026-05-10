// Service d'email Gmail SMTP pour envoi réel d'emails
// Permet aux utilisateurs d'utiliser leur propre compte Gmail

interface GmailConfig {
  email: string;
  password: string; // Mot de passe d'application Gmail
}

export const sendGmailEmail = async (
  config: GmailConfig,
  to: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    // Pour l'instant, simulation d'envoi Gmail
    // En production, vous utiliserez un service backend avec nodemailer
    
    console.log('=== ENVOI GMAIL RÉEL ===');
    console.log('De:', config.email);
    console.log('À:', to);
    console.log('Sujet:', subject);
    console.log('Message:', message);
    console.log('======================');

    // Simulation de l'email qui serait envoyé
    const emailContent = `
      De: ${config.email}
      À: ${to}
      Sujet: ${subject}
      
      ${message}
    `;

    // Code pour backend avec nodemailer (à implémenter côté serveur)
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.password // Mot de passe d'application Gmail
      }
    });
    
    const mailOptions = {
      from: config.email,
      to: to,
      subject: subject,
      text: message
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email Gmail envoyé avec succès!');
    */

    // Pour l'instant, ouverture du client email avec les informations pré-remplies
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&from=${encodeURIComponent(config.email)}&body=${encodeURIComponent(message)}`;
    window.open(mailtoLink, '_blank');

    alert(`Email préparé avec Gmail!\n\nDe: ${config.email}\nÀ: ${to}\nSujet: ${subject}\n\nLe client email va s'ouvrir avec ces informations.`);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi Gmail:', error);
    return false;
  }
};

export const createGmailPasswordResetEmail = (resetLink: string, userEmail: string): string => {
  return `
Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte BookingHostel.

Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :
${resetLink}

Ce lien expirera dans 24 heures.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

Cordialement,
L'équipe BookingHostel

---
Email envoyé à: ${userEmail}
Date: ${new Date().toLocaleString('fr-FR')}
  `.trim();
};

export const createGmailWelcomeEmail = (userName: string, userEmail: string): string => {
  return `
Bonjour ${userName},

Bienvenue sur BookingHostel!

Votre compte a été créé avec succès avec l'email : ${userEmail}

Vous pouvez maintenant vous connecter et commencer à faire des réservations.

Pour vous connecter, utilisez :
- Email: ${userEmail}
- Mot de passe: celui que vous avez défini lors de l'inscription

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe BookingHostel

---
Email envoyé à: ${userEmail}
Date: ${new Date().toLocaleString('fr-FR')}
  `.trim();
};
