'use client';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Vérifier si le token est valide (simulation)
    if (token && token.startsWith('reset-')) {
      setTokenValid(true);
    } else if (!token) {
      setError('Token de réinitialisation manquant');
    } else {
      setError('Token de réinitialisation invalide');
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      // Simuler la réinitialisation du mot de passe
      // Dans un vrai projet, vous vérifieriez le token et mettriez à jour la base de données
      console.log('Réinitialisation du mot de passe avec token:', token);
      console.log('Nouveau mot de passe:', newPassword);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid && !error) {
    return (
      <main className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Vérification du token...</div>
      </main>
    );
  }

  if (error && !success) {
    return (
      <main className="min-h-screen bg-[#0a1628]">
        <Navbar />
        <div className="pt-24 px-6 max-w-md mx-auto">
          <div className="bg-red-500 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-white text-2xl font-bold">Erreur</h2>
            <p className="text-white/80 mt-2">{error}</p>
            <Link href="/login" className="mt-4 bg-white text-red-600 px-6 py-2 rounded-full font-bold inline-block">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#0a1628]">
        <Navbar />
        <div className="pt-24 px-6 max-w-md mx-auto">
          <div className="bg-green-500 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-white text-2xl font-bold">Mot de passe réinitialisé!</h2>
            <p className="text-white/80 mt-2">Votre mot de passe a été mis à jour avec succès</p>
            <Link href="/login" className="mt-4 bg-white text-green-600 px-6 py-2 rounded-full font-bold inline-block">
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <Navbar />
      <div className="pt-24 px-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">🔑 Reset Password</h1>
        <p className="text-white/60 mb-8">Create your new password</p>

        <div className="bg-white rounded-2xl p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-yellow-400" 
              />
            </div>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-yellow-400" 
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a1628] text-white py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Resetting...' : '🔐 Reset Password'}
            </button>
          </form>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Note:</strong> Le mot de passe doit contenir au moins 6 caractères
            </p>
          </div>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-yellow-500 text-sm font-bold hover:text-yellow-400">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-white">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
