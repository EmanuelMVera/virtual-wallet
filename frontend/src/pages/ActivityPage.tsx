import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchHistory } from '../features/transactionSlice';
import { formatMoney } from '../utils/format';

export default function ActivityPage() {
  const dispatch = useAppDispatch();
  const { history, loading } = useAppSelector((s) => s.transaction);
  const user = useAppSelector((s) => s.user.user);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const getTransactionDetails = (tx: any) => {
    const isSender = tx.senderId === user?.id;
    if (tx.type === 'load' || tx.type === 'deposit') return { title: 'Ingreso', sign: '+', color: 'text-emerald-600', icon: '💰' };
    if (tx.type === 'withdraw') return { title: 'Retiro', sign: '-', color: 'text-slate-900', icon: '🏧' };

    if (isSender) {
      const r = tx.receiver;
      const name = r ? `${r.firstName} ${r.lastName}` : 'Usuario';
      return { title: `A ${name}`, sign: '-', color: 'text-rose-600', icon: '💸' };
    }

    const s = tx.sender;
    const name = s ? `${s.firstName} ${s.lastName}` : 'Usuario';
    return { title: `De ${name}`, sign: '+', color: 'text-emerald-600', icon: '📥' };
  };

  return (
    <div>
      <h1 className="page-title">Tu actividad</h1>
      <p className="page-subtitle mt-1">Seguimiento completo de ingresos, retiros y transferencias.</p>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {loading && <div className="p-8 text-center text-slate-500">Actualizando movimientos...</div>}

        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <span className="text-4xl">📭</span>
            <h3 className="mt-3 font-semibold text-slate-800">Aún no hay actividad registrada</h3>
            <p className="text-sm text-slate-500">Acá vas a ver ingresos, retiros y transferencias.</p>
          </div>
        )}

        {!loading && history.map((tx) => {
          const { title, sign, color, icon } = getTransactionDetails(tx);
          return (
            <div key={tx.id} className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 last:border-0 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-lg">{icon}</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
              </div>
              <div className={`text-sm font-bold tracking-tight sm:text-base ${color}`}>{sign} {formatMoney(tx.amount)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
