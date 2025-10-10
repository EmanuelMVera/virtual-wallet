import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { listTransactions } from '../features/transaction/transactionSlice';
import TxItem from '../components/transactions/TxItem';
import TxSkeleton from '../components/transactions/TxSkeleton';
import Card from '../components/ui/Card';
// import SectionTitle from "../components/ui/SectionTitle";
import type { Transaction } from '../types';

type Tab = 'all' | 'in' | 'out' | 'deposit';

/** Determina si la transacción es una entrada (true) o salida (false) */
function isIncoming(tx: Transaction, myAccountId?: number | null) {
  if (tx.type === 'deposit' || tx.type === 'transfer_in') return true;
  if (tx.type === 'transfer_out') return false;
  if (tx.type === 'transfer') {
    if (!myAccountId) return false;
    if (tx.receiverAccountId === myAccountId) return true;
    if (tx.senderAccountId === myAccountId) return false;
  }
  return false;
}

export default function ActivityPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.transaction);
  const myAccountId = useAppSelector((s) => s.account.me?.id ?? null);

  const [tab, setTab] = useState<Tab>('all');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    dispatch(listTransactions());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const byTab = (t: Transaction) => {
      if (tab === 'all') return true;
      if (tab === 'deposit') return t.type === 'deposit';
      if (tab === 'in') return isIncoming(t, myAccountId);
      if (tab === 'out') return !isIncoming(t, myAccountId);
      return true;
    };

    const byQuery = (t: Transaction) => {
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        String(t.amount).includes(needle) ||
        t.type.toLowerCase().includes(needle)
      );
    };

    return items.filter(byTab).filter(byQuery);
  }, [items, tab, q, myAccountId]);

  const visible = filtered.slice(0, limit);

  return (
    <div className="mx-auto max-w-screen-sm space-y-5 p-4">
      <h1 className="text-xl font-semibold">Movimientos</h1>

      {/* Filtros */}
      <div className="flex gap-2 overflow-auto pb-2">
        {[
          { k: 'all', label: 'Todos' },
          { k: 'in', label: 'Entradas' },
          { k: 'out', label: 'Salidas' },
          { k: 'deposit', label: 'Depósitos' },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => {
              setTab(t.k as Tab);
              setLimit(20);
            }}
            className={`rounded-full px-3 py-1 text-sm border transition ${
              tab === t.k
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <div>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(20);
          }}
          placeholder="Buscar por tipo o monto…"
          className="w-full rounded-xl border bg-white px-3 py-2 shadow-sm"
        />
      </div>

      {/* Contenido */}
      <Card className="p-3 space-y-3">
        {loading ? (
          <TxSkeleton />
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Sin movimientos para los filtros actuales.
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {visible.map((tx) => (
                <TxItem
                  key={tx.id}
                  tx={tx}
                  myAccountId={myAccountId}
                />
              ))}
            </ul>

            {visible.length < filtered.length && (
              <button
                onClick={() => setLimit((n) => n + 20)}
                className="mx-auto mt-4 block rounded-full border px-4 py-2 text-sm bg-white hover:shadow"
              >
                Ver más
              </button>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
