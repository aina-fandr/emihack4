import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Carte from './pages/Carte';
import PolicePortal from './pages/polices/PolicePortal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('accueil');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/^\/+/, '') || 'accueil';
    setCurrentTab(['accueil', 'carte', 'police', 'a-propos'].includes(path) ? path : 'accueil');
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    navigate(tab === 'accueil' ? '/' : `/${tab}`);
  };

  const renderPage = () => {
    switch (currentTab) {
      case 'accueil':
        return <Accueil />;
      case 'carte':
        return <Carte />;
      case 'police':
        return <PolicePortal onBackToAccueil={() => handleTabChange('accueil')} />;
      case 'a-propos':
        return <Accueil />;
      default:
        return <Accueil />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-white font-sans overflow-hidden select-none relative">
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="h-full w-full">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}
