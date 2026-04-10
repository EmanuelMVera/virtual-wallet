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

  return (
    <div className="mx-auto max-w-screen-sm p-4">
      <h1 className="text-2xl font-bold mb-4">Actividad</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && <div className="p-4 text-sm text-gray-500">Cargando movimientos...</div>}
        {!loading && history.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">No hay movimientos todavía.</div>
        )}
        {history.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
            <div>
              <div className="font-semibold text-sm">
                {tx.type === 'load' ? 'Ingreso' : tx.type === 'withdraw' ? 'Retiro' : 'Transferencia'}
              </div>
              <div className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</div>
            </div>
            <div className={`font-bold ${tx.senderDni === user?.dni ? 'text-gray-900' : 'text-green-600'}`}>
              {tx.senderDni === user?.dni ? '-' : '+'} {formatMoney(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
