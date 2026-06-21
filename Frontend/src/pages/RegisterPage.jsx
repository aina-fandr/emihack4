import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function RegisterPage() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return;
    }

    try {
      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler une inscription réussie
      setSuccess(true);
      setIsLoading(false);
      
      // Rediriger vers login après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError('Une erreur est survenue');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#bce3ff] via-[#e8f5ff] to-[#ffffff] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-gradient-to-br from-[#d4ecff] to-[#b0dcff] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row p-6 md:p-12 gap-8 border border-white/40 backdrop-blur-sm">
        
        {/* Logo */}
        <div className="absolute top-6 left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 text-xl font-black tracking-widest text-slate-800">
          🚦 TrafficAssist
        </div>

        {/* Illustration */}
        <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80" 
              alt="TrafficAssist Map Navigation"
              className="w-full h-auto object-contain rounded-2xl shadow-sm"
              style={{ filter: "drop-shadow(0px 15px 20px rgba(0,0,0,0.15))" }}
            />
            <div className="absolute top-1/4 left-1/3 text-red-500 text-6xl drop-shadow-lg">
              📍
            </div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center md:text-left">
              Créer un compte
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50/80 border border-red-200 rounded-xl text-red-600 text-xs text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-2.5 bg-green-50/80 border border-green-200 rounded-xl text-green-600 text-xs text-center animate-pulse">
                ✅ Inscription réussie ! Redirection vers la connexion...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 ml-2">Nom complet</label>
                <div className="relative">
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="votre nom"
                    className="w-full px-4 py-2.5 rounded-full bg-white text-slate-800 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                    required
                  />
                  {nom && (
                    <button type="button" onClick={() => setNom('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 ml-2">Adresse email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre email"
                    className="w-full px-4 py-2.5 rounded-full bg-white text-slate-800 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                    required
                  />
                  {email && (
                    <button type="button" onClick={() => setEmail('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 ml-2">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="code secret"
                    className="w-full px-4 py-2.5 rounded-full bg-white text-slate-800 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 ml-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="confirmer le code"
                    className="w-full px-4 py-2.5 rounded-full bg-white text-slate-800 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-4 bg-[#141226] text-white rounded-full font-medium tracking-wide shadow-lg hover:bg-[#23203f] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>S'inscrire</span>
                )}
              </button>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-medium">ou s'inscrire par</span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>

            <div className="flex justify-center gap-6 mb-6">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition">
                <GoogleIcon />
              </button>
              <button className="w-10 h-10 bg-[#1877f2] text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition">
                <FacebookIcon />
              </button>
            </div>

            <p className="text-center text-xs text-slate-600">
              Vous avez déjà un compte ? 
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 font-bold hover:underline ml-1"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icônes pour Register
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);