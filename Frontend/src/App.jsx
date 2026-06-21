import { useState } from 'react';
import Accueil from './pages/Accueil';
import Carte from './pages/Carte';
import DashboardPolice from './pages/DashboardPolice';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function App() {
  const [currentTab, setCurrentTab] = useState('accueil');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentTab) {
      case 'accueil':
        return <Accueil />;
      case 'carte':
        return <Carte />;
      case 'police':
        return <DashboardPolice />;
      default:
        return <Accueil />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-white font-sans overflow-hidden select-none relative">
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="h-full w-full">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
