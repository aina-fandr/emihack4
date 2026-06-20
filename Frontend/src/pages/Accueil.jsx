import { useState } from 'react';
import MapComponent from '../components/maps/MapComponent';
import Legend from '../components/common/Legend';
import ChatAssistant from '../components/common/ChatAssistant';

export default function Accueil() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="w-full h-full relative">
      {/* Carte */}
      <div className="absolute inset-0 z-0">
        <MapComponent />
      </div>

      {/* Légende */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-[1000]">
        <Legend />
      </div>

      {/* Menu des actions latérales */}
      <div className="absolute top-20 md:top-24 right-4 md:right-8 z-[1000] flex flex-col gap-2 md:gap-3">
        <button
          onClick={() => setActiveMenu(activeMenu === 'signaler' ? null : 'signaler')}
          className={`w-36 md:w-44 bg-red-500/90 hover:bg-red-600 text-white font-semibold py-2 md:py-3 px-3 md:px-4 rounded-xl shadow-lg border border-red-400/30 text-xs md:text-sm tracking-wide transition-all duration-300 transform hover:scale-105 hover:translate-x-[-4px] flex items-center gap-2 md:gap-3 ${
            activeMenu === 'signaler' ? 'ring-2 ring-red-400/50 ring-offset-2 ring-offset-black' : ''
          }`}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Signaler
        </button>

        <button
          onClick={() => setActiveMenu(activeMenu === 'itineraire' ? null : 'itineraire')}
          className={`w-36 md:w-44 bg-blue-500/90 hover:bg-blue-600 text-white font-semibold py-2 md:py-3 px-3 md:px-4 rounded-xl shadow-lg border border-blue-400/30 text-xs md:text-sm tracking-wide transition-all duration-300 transform hover:scale-105 hover:translate-x-[-4px] flex items-center gap-2 md:gap-3 ${
            activeMenu === 'itineraire' ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-black' : ''
          }`}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Itinéraire
        </button>

        <button
          onClick={() => setActiveMenu(activeMenu === 'prediction' ? null : 'prediction')}
          className={`w-36 md:w-44 bg-orange-500/90 hover:bg-orange-600 text-white font-semibold py-2 md:py-3 px-3 md:px-4 rounded-xl shadow-lg border border-orange-400/30 text-xs md:text-sm tracking-wide transition-all duration-300 transform hover:scale-105 hover:translate-x-[-4px] flex items-center gap-2 md:gap-3 ${
            activeMenu === 'prediction' ? 'ring-2 ring-orange-400/50 ring-offset-2 ring-offset-black' : ''
          }`}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm12 0v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
          Prédiction
        </button>
      </div>

      {/* Bouton de recherche flottant */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="transition-all duration-300">
          {!searchOpen ? (
            <button 
              onClick={() => setSearchOpen(true)}
              className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-600 hover:to-blue-700 p-3 md:p-5 rounded-2xl shadow-2xl border border-blue-400/30 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-12 animate-bounce-slow"
            >
              <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          ) : (
            <div className="bg-black/90 backdrop-blur-md rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-2xl border border-blue-500/30 flex items-center gap-3 md:gap-4 w-64 md:w-96 animate-fade-in-up">
              <svg onClick={() => setSearchOpen(false)} className="w-4 h-4 md:w-5 md:h-5 text-blue-400 cursor-pointer hover:text-blue-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Rechercher un lieu..." 
                className="w-full bg-transparent text-xs md:text-sm font-medium text-white placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Assistant IA */}
      <ChatAssistant />
    </div>
  );
}