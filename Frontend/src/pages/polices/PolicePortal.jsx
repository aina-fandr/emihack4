import React, { useEffect, useState } from 'react';
import PoliceLogin from './PoliceLogin';
import DashboardPolice from './DashboardPolice';

export default function PolicePortal({ onBackToAccueil }) {
  const [policeUser, setPoliceUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('police_token');
    const user = localStorage.getItem('police_user');

    if (token && user) {
      try {
        setPoliceUser(JSON.parse(user));
      } catch (error) {
        localStorage.removeItem('police_token');
        localStorage.removeItem('police_user');
      }
    }

    setInitialized(true);
  }, []);

  const handleLoginSuccess = (user) => {
    setPoliceUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('police_token');
    localStorage.removeItem('police_user');
    setPoliceUser(null);
  };

  if (!initialized) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-slate-300">Chargement de l’espace police...</p>
        </div>
      </div>
    );
  }

  return policeUser ? (
    <DashboardPolice
      policeUser={policeUser}
      onLogout={handleLogout}
      onBackToAccueil={onBackToAccueil}
    />
  ) : (
    <PoliceLogin onLoginSuccess={handleLoginSuccess} onBack={onBackToAccueil} />
  );
}
