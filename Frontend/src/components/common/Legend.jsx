export default function Legend() {
  const legendItems = [
    { color: 'bg-green-500', label: 'Fluide' },
    { color: 'bg-yellow-500', label: 'Trafic modéré' },
    { color: 'bg-orange-500', label: 'Trafic dense' },
    { color: 'bg-red-500', label: 'Embouteillage sévère' },
  ];

  return (
    <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-700 w-56">
      <h3 className="text-lg font-bold mb-4 tracking-wide text-white">Légende</h3>
      <div className="space-y-4">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`h-2 w-8 ${item.color} rounded-full`}></div>
            <span className="text-xs text-slate-300 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}