import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Carte from './pages/Carte';
import DashboardPolice from './pages/polices/DashboardPolice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import PoliceLogin from './pages/polices/PoliceLogin';

// Layout pour les pages authentifiées
function AuthenticatedLayout({ children, currentTab, setCurrentTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-white font-sans overflow-hidden select-none relative">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="h-full w-full">
        {children}
      </main>
    </div>
  );
}

// Composant principal
function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('accueil');

  // Fonction pour rendre la page selon l'onglet
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

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/police/login" element={<PoliceLogin />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // Si authentifié, afficher l'application avec l'onglet actif
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/accueil" replace />} />
        
        {/* Routes Police */}
        <Route path="/police/login" element={<PoliceLogin />} />
        <Route path="/police/dashboard" element={<DashboardPolice />} />
        <Route path="/police" element={<Navigate to="/police/login" replace />} />

        {/* Routes protégées */}
        <Route path="/accueil" element={
          <AuthenticatedLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
            {renderPage()}
          </AuthenticatedLayout>
        } />

        <Route path="/carte" element={
          <AuthenticatedLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
            {renderPage()}
          </AuthenticatedLayout>
        } />

        <Route path="*" element={<Navigate to="/accueil" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;