import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, HelpCircle, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar({ currentTab, setCurrentTab, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Changer d'onglet instantanément
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <>
      <div className="absolute top-3 md:top-5 left-0 right-0 mx-auto max-w-4xl px-3 md:px-4 z-[1000] flex items-center justify-between">
        {/* Logo + Menu hamburger */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-blue-400 transition p-1.5 md:p-2 bg-black/50 rounded-xl backdrop-blur-sm"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-base md:text-2xl font-black tracking-wider text-white bg-blue-600/20 backdrop-blur-md px-3 md:px-4 py-1 md:py-1.5 rounded-xl border border-blue-500/30 whitespace-nowrap">
            🚦 TrafficAssist
          </div>
        </div>

        {/* Menu de navigation */}
        <nav className="hidden sm:flex items-center bg-black/80 backdrop-blur-md rounded-full p-1 shadow-2xl border border-slate-800 px-2 md:px-4">
          <button
            onClick={() => handleTabChange('accueil')}
            className={`text-xs md:text-sm font-bold px-3 md:px-6 py-1.5 md:py-2 rounded-full transition-all duration-200 ${currentTab === 'accueil' ? 'bg-blue-500 text-white' : 'text-white hover:text-slate-300'
              }`}
          >
            Accueil
          </button>
          <button
            onClick={() => handleTabChange('carte')}
            className={`text-xs md:text-sm font-bold px-3 md:px-6 py-1.5 md:py-2 rounded-full transition-all duration-200 ${currentTab === 'carte' ? 'bg-blue-500 text-white' : 'text-white hover:text-slate-300'
              }`}
          >
            Carte
          </button>
          <button
            onClick={() => handleTabChange('police')}
            className={`text-xs md:text-sm font-bold px-3 md:px-6 py-1.5 md:py-2 rounded-full transition-all duration-200 ${currentTab === 'police' ? 'bg-blue-500 text-white' : 'text-white hover:text-slate-300'
              }`}
          >
            Police
          </button>
          <button
            onClick={() => handleTabChange('a-propos')}
            className={`text-xs md:text-sm font-bold px-3 md:px-6 py-1.5 md:py-2 rounded-full transition-all duration-200 ${currentTab === 'a-propos' ? 'bg-blue-500 text-white' : 'text-white hover:text-slate-300'
              }`}
          >
            À propos
          </button>
        </nav>

        {/* Menu mobile */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => handleTabChange('accueil')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 ${currentTab === 'accueil' ? 'bg-blue-500 text-white' : 'text-white'
              }`}
          >
            Accueil
          </button>
          <button
            onClick={() => handleTabChange('carte')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 ${currentTab === 'carte' ? 'bg-blue-500 text-white' : 'text-white'
              }`}
          >
            Carte
          </button>
        </div>

        {/* Avatar et déconnexion */}
        <div className="flex items-center gap-2 md:gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-blue-500/50 overflow-hidden hover:ring-2 hover:ring-blue-400 transition bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm md:text-base"
            >
              {user?.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
            </button>

            {avatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/50 py-2 z-[1001]">
                <div className="px-4 py-2 border-b border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-500/50 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user?.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {user?.nom || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.email || 'user@email.com'}
                    </p>
                  </div>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <Settings className="w-4 h-4" />
                  Paramètres
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <HelpCircle className="w-4 h-4" />
                  Aide
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition border-t border-slate-200 mt-1 pt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      {searchOpen && (
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-[1001] w-[90%] max-w-md">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-2xl border border-slate-700">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher une rue, un quartier..."
                className="w-full bg-transparent text-xs md:text-sm font-medium text-white placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}