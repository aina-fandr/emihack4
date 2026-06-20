import React from 'react';

export default function ActionSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-full md:w-[400px] bg-slate-900 text-slate-100 flex flex-col z-[1000] shadow-2xl border-r border-slate-800 absolute bottom-0 left-0 right-0 top-auto md:static max-h-[55vh] md:max-h-full overflow-y-auto">
      
      {activeTab === 'home' && (
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">TrafficAssist</h2>
            <p className="text-xs text-slate-400 mt-1">Antananarivo - Transports Urbains</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">État du trafic</span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-green-400">Fluide</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setActiveTab('signalement')} 
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition"
            >
              ⚠ Signaler un événement
            </button>
            <button 
              onClick={() => setActiveTab('itineraire')} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition"
            >
              🚀 Calculer un Itinéraire
            </button>
            <button 
              onClick={() => setActiveTab('predictions')} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition"
            >
              📊 Prédictions horaires
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800 p-2 rounded-lg">
              <div className="text-2xl font-bold text-green-400">42</div>
              <div className="text-xs text-slate-400">Routes vertes</div>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">8</div>
              <div className="text-xs text-slate-400">Routes orange</div>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg">
              <div className="text-2xl font-bold text-red-400">3</div>
              <div className="text-xs text-slate-400">Routes rouges</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'signalement' && (
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">🚨 Signaler un événement</h3>
            <button onClick={() => setActiveTab('home')} className="text-slate-400 hover:text-white text-sm p-2">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl font-bold flex flex-col items-center gap-2">
              <span className="text-2xl">🚗</span><span>Embouteillage</span>
            </button>
            <button className="bg-orange-500/20 border border-orange-500 text-orange-400 p-4 rounded-xl font-bold flex flex-col items-center gap-2">
              <span className="text-2xl">🏍</span><span>Ralentissement</span>
            </button>
            <button className="bg-red-600/20 border border-red-600 text-red-400 p-4 rounded-xl font-bold flex flex-col items-center gap-2">
              <span className="text-2xl">💥</span><span>Accident</span>
            </button>
            <button className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 p-4 rounded-xl font-bold flex flex-col items-center gap-2">
              <span className="text-2xl">🚧</span><span>Travaux</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'itineraire' && (
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">🚀 Calculer un itinéraire</h3>
            <button onClick={() => setActiveTab('home')} className="text-slate-400 hover:text-white text-sm p-2">✕</button>
          </div>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Destination" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500"
            />
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition">
              Calculer l'itinéraire
            </button>
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">📊 Prédictions horaires</h3>
            <button onClick={() => setActiveTab('home')} className="text-slate-400 hover:text-white text-sm p-2">✕</button>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Heures de pointe</span>
              <span className="text-amber-400 font-bold">🚨 7h30 - 9h00</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-400">Soir</span>
              <span className="text-orange-400 font-bold">⚠️ 17h00 - 19h00</span>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
}