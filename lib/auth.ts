import bcrypt from 'bcryptjs';

// Hashage du mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Complexité élevée pour la sécurité
  return await bcrypt.hash(password, saltRounds);
};

// Vérification du mot de passe
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Génération de token JWT simple (en production, utiliser jsonwebtoken)
export const generateToken = (userId: string, email: string): string => {
  const payload = {
    userId,
    email,
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 heures
  };
  return btoa(JSON.stringify(payload));
};

// Vérification du token
export const verifyToken = (token: string): { userId: string; email: string } | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null; // Token expiré
    }
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
};

// Validation du format email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation du mot de passe
export const isValidPassword = (password: string): boolean => {
  // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Sanitization des entrées
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, ''); // Remove HTML tags
};
