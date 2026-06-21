import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { policeService } from '../../services/police.api';

// Simulation des identifiants (fallback si API non disponible)
const SIMULATION_CREDENTIALS = {
  username: 'officier',
  password: 'police123',
  user: {
    id: 2,
    badge: 'P-2024-001',
    username: 'officier',
    email: 'police@trafficassist.mg',
    fullName: 'Officier de Police',
    rank: 'Officier Principal',
    zone: 'Analamanga',
    precinct: 'Commissariat Central',
    phone: '+261 34 01 234 567',
    isActive: true
  }
};

export default function PoliceLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Tentative 1: Appel API réel
      try {
        const response = await policeService.login(username, password);
        
        if (response.success) {
          localStorage.setItem('police_token', response.token);
          localStorage.setItem('police_user', JSON.stringify(response.user));
          
          setIsLoading(false);
          
          if (onLoginSuccess) {
            onLoginSuccess(response.user);
          }
          
          navigate('/police/dashboard');
          return;
        }
      } catch (apiError) {
        console.log('API non disponible, utilisation de la simulation');
        // Si l'API échoue, passer à la simulation
      }

      // Tentative 2: Simulation
      if (username === SIMULATION_CREDENTIALS.username && 
          password === SIMULATION_CREDENTIALS.password) {
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userData = SIMULATION_CREDENTIALS.user;
        localStorage.setItem('police_token', 'simulation-police-token-12345');
        localStorage.setItem('police_user', JSON.stringify(userData));
        
        setIsLoading(false);
        
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        }
        
        navigate('/police/dashboard');
        return;
      }

      // Si ni API ni simulation ne fonctionnent
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIsLoading(false);
      
      if (newAttempts >= 3) {
        setError('⚠️ Vous avez dépassé le nombre de tentatives autorisées. Veuillez contacter votre supérieur.');
      } else {
        setError(`⚠️ Identifiants incorrects. Tentative ${newAttempts}/3.`);
      }

    } catch (error) {
      console.error('Erreur:', error);
      setIsLoading(false);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleBack = () => {
    navigate('/accueil');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Effet de fond */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562519995-3f7f4f23b8d3?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Espace Police</h1>
            <p className="text-sm text-slate-400 mt-1">Accès réservé aux agents de police</p>
          </div>

          {/* Alerte d'information */}
          <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-yellow-400 font-medium">Accès restreint</p>
              <p className="text-xs text-slate-400">
                Veuillez demander vos identifiants à votre supérieur ou à la personne responsable.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                attempts >= 3 
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                  : 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
              }`}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Identifiant</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre identifiant police"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={attempts >= 3}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                  required
                  disabled={attempts >= 3}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                💡 Identifiant: <span className="text-blue-400">officier</span> | Mot de passe: <span className="text-blue-400">police123</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || attempts >= 3}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Vérification...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Accéder au Dashboard
                </>
              )}
            </button>

            {attempts >= 3 && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAttempts(0);
                    setError('');
                    setUsername('');
                    setPassword('');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  🔄 Réinitialiser les tentatives
                </button>
              </div>
            )}
          </form>

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBack}
              className="text-xs text-slate-400 hover:text-slate-300 transition flex items-center justify-center gap-1"
            >
              <X className="w-3 h-3" />
              Retour à l'accueil
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-slate-500">
          <p>🚦 TrafficAssist • Plateforme Police</p>
          <p className="text-[10px] text-slate-600">Accès sécurisé - Contactez votre supérieur pour les identifiants</p>
        </div>
      </div>
    </div>
  );
}