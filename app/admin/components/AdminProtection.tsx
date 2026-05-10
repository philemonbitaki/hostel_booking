'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Session timeout: 10 secondes (protection maximale)
  const SESSION_TIMEOUT = 10 * 1000;

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authTime = localStorage.getItem('adminAuthTime');
        const isAdminAuth = localStorage.getItem('adminAuth') === 'true';
        
        if (isAdminAuth && authTime) {
          const currentTime = new Date().getTime();
          const loginTime = parseInt(authTime);
          
          // Vérifier si la session n'a pas expiré
          if (currentTime - loginTime < SESSION_TIMEOUT) {
            setIsAuthenticated(true);
          } else {
            // Session expirée, nettoyer et rediriger
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('adminAuthTime');
            router.push('/admin/login');
          }
        } else {
          // Pas authentifié, rediriger vers login
          router.push('/admin/login');
        }
      } catch (error) {
        // En cas d'erreur, rediriger vers login
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Vérification de l'authentification...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Redirection vers la connexion...</div>
      </main>
    );
  }

  return <>{children}</>;
}
