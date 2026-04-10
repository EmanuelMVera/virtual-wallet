import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchHistory } from '../features/transactionSlice';
import { formatMoney } from '../utils/format';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { history } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const getTransactionDetails = (tx: any) => {
    const isSender = tx.senderId === user?.id;
    if (tx.type === 'load' || tx.type === 'deposit') return { title: 'Ingreso', sign: '+', color: 'text-emerald-600', icon: '📥' };
    if (tx.type === 'withdraw') return { title: 'Retiro', sign: '-', color: 'text-slate-900', icon: '🏧' };

    if (isSender) {
      const r = tx.receiver;
      const displayName = r ? `${r.firstName} ${r.lastName} (${r.alias})` : 'Usuario';
      return { title: `A ${displayName}`, sign: '-', color: 'text-rose-600', icon: '💸' };
    }

    const s = tx.sender;
    const displayName = s ? `${s.firstName} ${s.lastName} (${s.alias})` : 'Usuario';
    return { title: `De ${displayName}`, sign: '+', color: 'text-emerald-600', icon: '💰' };
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-2xl shadow-blue-200/60">
        <p className="text-sm font-semibold text-blue-100">Dinero disponible</p>
        <h2 className="mt-2 text-4xl font-black tracking-tight">{user ? formatMoney(user.balance) : '...'}</h2>
        <p className="mt-2 text-sm text-blue-100">Tu balance se actualiza automáticamente con cada operación.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <QuickLink to="/transfer" icon="💸" label="Transferir" />
        <QuickLink to="/add-money" icon="💳" label="Ingresar" />
        <QuickLink to="/withdraw" icon="🏧" label="Retirar" />
        <QuickLink to="/activity" icon="📊" label="Actividad" />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="font-bold text-slate-800">Última actividad</h3>
          <Link to="/activity" className="text-sm font-semibold text-blue-700 hover:underline">Ver todo</Link>
        </div>

        {history.length > 0 ? (
          history.slice(0, 6).map((tx) => {
            const { title, sign, color, icon } = getTransactionDetails(tx);
            return (
              <div key={tx.id} className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50 border-b border-slate-100 last:border-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">{icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
                    <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                  </div>
                </div>
                <span className={`ml-3 font-bold ${color}`}>{sign} {formatMoney(tx.amount)}</span>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center">
            <p className="text-3xl">📭</p>
            <p className="mt-2 font-semibold text-slate-800">Aún no hay actividad</p>
            <p className="text-sm text-slate-500">Tus movimientos recientes aparecerán acá.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link to={to} className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-blue-700">{label}</p>
    </Link>
  );
}
