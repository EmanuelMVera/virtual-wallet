import TxItem from "./TxItem";
import Card from "../ui/Card";
import type { Transaction } from "../../types/types";

interface ActivityListProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  myAccountId: number | null;
  limit: number;
  onLoadMore: () => void;
}

export default function ActivityList({
  transactions,
  loading,
  error,
  myAccountId,
  limit,
  onLoadMore
}: ActivityListProps) {
  const visible = transactions.slice(0, limit);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin movimientos</h3>
        <p className="text-gray-600">No hay transacciones que coincidan con los filtros seleccionados</p>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <ul className="divide-y divide-gray-100">
        {visible.map((tx) => (
          <TxItem key={tx.id} tx={tx} myAccountId={myAccountId} />
        ))}
      </ul>
      {visible.length < transactions.length && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLoadMore}
            className="w-full rounded-xl border border-gray-200 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            <span className="flex items-center justify-center gap-2">
              <span>⬇️</span>
              Ver más transacciones
            </span>
          </button>
        </div>
      )}
    </Card>
  );
}