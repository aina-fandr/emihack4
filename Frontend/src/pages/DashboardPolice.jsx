export default function DashboardPolice() {
  return (
    <div className="w-full h-full bg-white text-slate-800 p-8 flex flex-col overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">🚔 Dashboard Police</h1>
          <p className="text-slate-500 text-sm">Gestion du trafic en temps réel</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 rounded-full px-4 py-2 text-sm font-medium text-slate-700">
            📍 Antananarivo
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            En ligne
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Bouchons', value: '14', color: 'text-red-500' },
          { label: 'Alertes actives', value: '8', color: 'text-orange-500' },
          { label: 'Agents déployés', value: '23', color: 'text-blue-500' },
          { label: 'Signalements', value: '47', color: 'text-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color} mt-2`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-6 min-h-[400px]">
        <div className="col-span-5 row-span-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between text-white">
          <div>
            <h4 className="font-bold text-slate-400 text-sm uppercase tracking-wider">Axe critique en direct</h4>
            <div className="mt-4 space-y-3">
              {[
                { name: 'Anosizato', status: 'Critique', color: 'text-red-400' },
                { name: 'Andraharo', status: 'Ralentissement', color: 'text-orange-400' },
                { name: 'Analakely', status: 'Fluide', color: 'text-green-400' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                  <span>{item.name}</span>
                  <span className={`${item.color} font-bold`}>
                    {item.status === 'Critique' ? '🔴' : item.status === 'Ralentissement' ? '🟠' : '🟢'} {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-slate-500">Dernière mise à jour: il y a 2 min</div>
        </div>

        <div className="col-span-7 row-span-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-6 shadow-lg border border-blue-200">
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-4">Historique des alertes</h4>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">Alerte #{i}</p>
                  <p className="text-xs text-slate-500">Il y a {i * 5} minutes</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  i % 3 === 0 ? 'bg-red-100 text-red-600' : 
                  i % 2 === 0 ? 'bg-orange-100 text-orange-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {i % 3 === 0 ? 'Critique' : i % 2 === 0 ? 'Modéré' : 'Résolu'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 row-span-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl p-6 shadow-lg border border-purple-200">
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Interventions</h4>
          <div className="mt-3">
            <div className="text-3xl font-black text-purple-600">12</div>
            <p className="text-sm text-slate-500">En cours</p>
          </div>
        </div>

        <div className="col-span-9 row-span-2 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-3xl p-6 shadow-lg border border-emerald-200">
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Agents déployés</h4>
          <div className="flex items-center gap-6 mt-3">
            {['🚓', '🚓', '🚓', '🚓', '🚓'].map((emoji, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs text-slate-500">Agent {i + 1}</span>
              </div>
            ))}
            <button className="text-blue-500 text-sm font-medium hover:underline">
              Voir tous →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}