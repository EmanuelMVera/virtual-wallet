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

  // Helper para saber cómo renderizar cada item del historial
  const getTransactionDetails = (tx: any) => {
    const isSender = tx.senderId === user?.id;
    if (tx.type === 'load' || tx.type === 'deposit') return { title: 'Ingreso', sign: '+', color: 'text-green-600', icon: '💰' };
    if (tx.type === 'withdraw') return { title: 'Retiro', sign: '-', color: 'text-gray-900', icon: '🏧' };
    
    if (isSender) {
      const r = tx.receiver;
      const name = r ? `${r.firstName} ${r.lastName}` : 'Usuario';
      return { title: `A ${name}`, sign: '-', color: 'text-red-500', icon: '💸'  };
    } else {
      const s = tx.sender;
      const name = s ? `${s.firstName} ${s.lastName}` : 'Usuario';
      return { title: `De ${name}`, sign: '+', color: 'text-green-600', icon: '📥' };
    }
  };

  return (
    <div className="mx-auto max-w-screen-sm p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tu actividad</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[200px]">
        {loading && <div className="p-8 text-center text-gray-500">Actualizando movimientos...</div>}
        
        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <span className="text-4xl mb-3">📭</span>
            <h3 className="font-semibold text-gray-800">Aún no hay ninguna actividad registrada</h3>
            <p className="text-sm text-gray-500 mt-1">Acá vas a ver tus ingresos, retiros y transferencias.</p>
          </div>
        )}

        {!loading && history.map((tx) => {
          const { title, sign, color, icon } = getTransactionDetails(tx);
          return (
            <div key={tx.id} className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{title}</div>
                  <div className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</div>
                </div>
              </div>
              <div className={`font-bold text-base tracking-tight ${color}`}>
                {sign} {formatMoney(tx.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}