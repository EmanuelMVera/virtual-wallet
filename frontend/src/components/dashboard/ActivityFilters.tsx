

import Card from "../ui/Card";

type Tab = "all" | "in" | "out" | "deposit";

interface ActivityFiltersProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onFilterChange: () => void;
}

export default function ActivityFilters({
  tab,
  onTabChange,
  query,
  onQueryChange,
  onFilterChange
}: ActivityFiltersProps) {
  return (
    <Card className="p-4">
      {/* filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { k: "all", label: "Todas", icon: "📊" },
          { k: "in", label: "Entradas", icon: "⬇️" },
          { k: "out", label: "Salidas", icon: "⬆️" },
          { k: "deposit", label: "Depósitos", icon: "💰" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => {
              onTabChange(t.k as Tab);
              onFilterChange();
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm border transition-all duration-200 whitespace-nowrap ${
              tab === t.k
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* búsqueda */}
      <div className="mt-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              onFilterChange();
            }}
            placeholder="Buscar por tipo o monto…"
            className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </Card>
  );
}