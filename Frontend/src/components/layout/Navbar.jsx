import { useState } from 'react';

export default function Navbar({ currentTab, setCurrentTab, setSidebarOpen }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="absolute top-5 left-0 right-0 mx-auto max-w-4xl px-4 z-[1000] flex items-center justify-between">
        {/* Logo + Menu hamburger à gauche */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-blue-400 transition p-2 bg-black/50 rounded-xl backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-2xl font-black tracking-wider text-white bg-blue-600/20 backdrop-blur-md px-4 py-1.5 rounded-xl border border-blue-500/30">
            🚦 TrafficAssist
          </div>
        </div>

        {/* Menu de navigation */}
        <nav className="flex items-center bg-black/80 backdrop-blur-md rounded-full p-1.5 shadow-2xl border border-slate-800 w-[55%] justify-between px-4">
          <button 
            onClick={() => setCurrentTab('accueil')}
            className={`text-sm font-bold px-6 py-2 rounded-full transition-all duration-200 ${
              currentTab === 'accueil' ? 'bg-blue-500 text-white' : 'text-white hover:text-slate-300'
            }`}
          >
            Accueil
          </button>
          <button 
            onClick={() => setCurrentTab('carte')}
            className={`text-sm font-bold px-6 py-2 rounded-full transition-all duration-200 ${
              currentTab === 'carte' ? 'bg-blue-500 text-white' : 'text-white hover:text-slate-300'
            }`}
          >
            Carte
          </button>
          <button 
            onClick={() => setCurrentTab('police')}
            className={`text-sm font-bold px-6 py-2 rounded-full transition-all duration-200 ${
              currentTab === 'police' ? 'bg-blue-500 text-white' : 'text-white hover:text-slate-300'
            }`}
          >
            Police
          </button>
          <button 
            onClick={() => setCurrentTab('a-propos')}
            className={`text-sm font-bold px-6 py-2 rounded-full transition-all duration-200 ${
              currentTab === 'a-propos' ? 'bg-blue-500 text-white' : 'text-white hover:text-slate-300'
            }`}
          >
            À propos
          </button>
        </nav>

        {/* Icône de déconnexion */}
        <button className="text-white hover:text-red-400 transition p-2 bg-black/50 rounded-xl backdrop-blur-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 011-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Barre de recherche popup */}
      {searchOpen && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] w-96">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Rechercher une rue, un quartier..."
                className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-400 focus:outline-none"
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