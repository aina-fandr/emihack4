import { useState } from 'react';
import MapComponent from './components/MapComponent';
import ActionSidebar from './components/ActionSidebar';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userLocation] = useState({ lat: -18.9137, lng: 47.5361 });

  return (
    <AuthProvider>
      <div className="h-screen w-screen flex flex-col font-sans overflow-hidden bg-slate-950">
        
        {/* Top Bar de navigation */}
        <header className="w-full bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shadow-md z-[2000]">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-blue-500">TrafficAssist</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Mode Simulation
            </div>
          </div>
        </header>

        {/* Corps principal de l'application */}
        <div className="flex-1 flex relative overflow-hidden">
          
          {/* Panneau latéral gauche */}
          <ActionSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Zone Cartographique principale */}
          <div className="flex-1 h-full w-full relative">
            <MapComponent userLocation={userLocation} />
          </div>

        </div>
      </div>
    </AuthProvider>
  );
}

export default App;