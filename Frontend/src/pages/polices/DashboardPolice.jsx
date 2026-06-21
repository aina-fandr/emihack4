import React from 'react';
import { 
  Shield, AlertTriangle, MapPin, Users, Activity,
  Bell, Clock, ChevronRight, LogOut, Home, RefreshCw,
  Calendar, Clock as ClockIcon
} from 'lucide-react';

export default function DashboardPolice({ policeUser, onLogout, onBackToAccueil }) {

  const mockAlerts = [
    { id: 1, title: 'Embouteillage sévère Anosizato', location: 'Anosizato', severity: 'critical', status: 'in_progress', time: '5 min', description: 'Trafic totalement bloqué sur l\'axe RN1' },
    { id: 2, title: 'Accident signalé Ivandry', location: 'Ivandry', severity: 'urgent', status: 'pending', time: '12 min', description: 'Accident entre deux véhicules' },
    { id: 3, title: 'Travaux en cours Analakely', location: 'Analakely', severity: 'moderate', status: 'pending', time: '20 min', description: 'Travaux de voirie' },
    { id: 4, title: 'Ralentissement Andraharo', location: 'Andraharo', severity: 'normal', status: 'resolved', time: '35 min', description: 'Trafic ralenti' },
    { id: 5, title: 'Feux tricolores en panne', location: 'Mahamasina', severity: 'urgent', status: 'in_progress', time: '45 min', description: 'Intersection non régulée' },
    { id: 6, title: 'Embouteillage 67 Ha', location: '67 Ha', severity: 'critical', status: 'pending', time: '1h', description: 'Circulation très dense' },
    { id: 7, title: 'Incendie à Andravoahangy', location: 'Andravoahangy', severity: 'critical', status: 'pending', time: '1h 15min', description: 'Intervention des pompiers' },
    { id: 8, title: 'Manifestation à Analakely', location: 'Analakely', severity: 'urgent', status: 'in_progress', time: '1h 30min', description: 'Rassemblement citoyen' },
  ];

  const mockOfficers = [
    { id: 1, name: 'Jean Rabe', badge: 'P-2024-001', zone: 'Analamanga', status: 'En service' },
    { id: 2, name: 'Marie Randria', badge: 'P-2024-002', zone: 'Atsinanana', status: 'En service' },
    { id: 3, name: 'Pierre Rakoto', badge: 'P-2024-003', zone: 'Vakinankaratra', status: 'En repos' },
    { id: 4, name: 'Sarah Andriana', badge: 'P-2024-004', zone: 'Analamanga', status: 'En service' },
    { id: 5, name: 'Lucas Ranaivo', badge: 'P-2024-005', zone: 'Haute Matsiatra', status: 'En service' },
    { id: 6, name: 'Emma Razafy', badge: 'P-2024-006', zone: 'Boeny', status: 'En service' },
    { id: 7, name: 'Thomas Rakoto', badge: 'P-2024-007', zone: 'Diana', status: 'En repos' },
    { id: 8, name: 'Sophie Rajaona', badge: 'P-2024-008', zone: 'Analamanga', status: 'En service' },
  ];

  if (!policeUser) {
    return null;
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-500',
      urgent: 'bg-orange-500',
      moderate: 'bg-yellow-500',
      normal: 'bg-green-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400' },
      in_progress: { label: 'En cours', color: 'bg-blue-500/20 text-blue-400' },
      resolved: { label: 'Résolu', color: 'bg-green-500/20 text-green-400' },
      cancelled: { label: 'Annulé', color: 'bg-red-500/20 text-red-400' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="h-screen bg-slate-900 overflow-y-auto overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 py-4 -mt-2 px-4 -mx-4 rounded-b-2xl border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              Dashboard Police
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {policeUser?.fullName || 'Officier'} • Badge: {policeUser?.badge || 'P-2024-001'} • Zone: {policeUser?.zone || 'Analamanga'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={() => onBackToAccueil?.()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-sm"
            >
              <Home className="w-4 h-4" />
              Accueil
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition text-sm border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-500">5</div>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm text-slate-400 mt-1">Alertes critiques</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-yellow-500">8</div>
              <Bell className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-sm text-slate-400 mt-1">En cours</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-500">23</div>
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-400 mt-1">Agents actifs</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-500">47</div>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-slate-400 mt-1">Interventions</p>
          </div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne de gauche */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Alertes récentes
                <span className="text-xs text-slate-400 ml-2">({mockAlerts.length})</span>
              </h2>
              <div className="space-y-3">
                {mockAlerts.map((alerte) => (
                  <div key={alerte.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-slate-900 rounded-xl hover:bg-slate-900/80 transition cursor-pointer gap-2">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alerte.severity)}`} />
                      <div>
                        <p className="text-sm font-medium text-white">{alerte.title}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                          <MapPin className="w-3 h-3" />
                          {alerte.location}
                          <Clock className="w-3 h-3 ml-1" />
                          {alerte.time}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">{alerte.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-7 md:ml-0">
                      <span className={`text-[10px] px-2 py-1 rounded-full ${getStatusBadge(alerte.status).color}`}>
                        {getStatusBadge(alerte.status).label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Agents en service
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockOfficers.map((agent) => (
                  <div key={agent.id} className="bg-slate-900 rounded-xl p-3 border border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{agent.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{agent.badge}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{agent.zone}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        agent.status === 'En service' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne de droite */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Mon statut
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                  <span className="text-sm text-slate-400">Statut</span>
                  <span className="text-sm font-medium text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    En service
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                  <span className="text-sm text-slate-400">Zone</span>
                  <span className="text-sm font-medium text-white">{policeUser?.zone || 'Analamanga'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                  <span className="text-sm text-slate-400">Badge</span>
                  <span className="text-sm font-medium text-white">{policeUser?.badge || 'P-2024-001'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                  <span className="text-sm text-slate-400">Interventions</span>
                  <span className="text-sm font-medium text-white">47</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Mettre à jour
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
              <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                📢 Information
              </h2>
              <p className="text-xs text-slate-400">
                Restez connecté pour recevoir les alertes en temps réel. 
                Les informations sont mises à jour automatiquement.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                Dernière mise à jour: {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-slate-400" />
                Activité récente
              </h2>
              <div className="space-y-2">
                {[
                  { action: 'Alerte critique traitée', time: '5 min' },
                  { action: 'Intervention terminée', time: '15 min' },
                  { action: 'Nouvelle alerte reçue', time: '25 min' },
                  { action: 'Agent déployé', time: '45 min' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                    <span className="text-xs text-slate-300">{item.action}</span>
                    <span className="text-[10px] text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>🚦 TrafficAssist • Plateforme Police v1.0</p>
          <p className="text-[10px] text-slate-600 mt-1">Données mises à jour en temps réel</p>
        </div>
      </div>
    </div>
  );
}