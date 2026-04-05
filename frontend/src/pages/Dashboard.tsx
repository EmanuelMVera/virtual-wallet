import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransaction';
import { useAppSelector } from '../app/hooks';
import { formatMoney } from '../utils/format';

export default function Dashboard() {
  const { user } = useAppSelector(state => state.user);
  const { transactions, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Hero saldo */}
      <div className="bg-[#009EE3] text-white pt-8 pb-14 px-4">
        <div className="mx-auto max-w-screen-sm">
          <p className="text-sm opacity-90">Dinero disponible</p>
          <h2 className="text-4xl font-bold mt-1">
            {user ? formatMoney(user.balance) : 'Cargando...'}
          </h2>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mx-auto w-full max-w-screen-sm px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <Link to="/transfer" className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600">
            <div className="bg-gray-100 p-3 rounded-full text-xl">💸</div>
            <span className="text-xs font-semibold">Transferir</span>
          </Link>
          <Link to="/pay" className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600">
            <div className="bg-gray-100 p-3 rounded-full text-xl">🛒</div>
            <span className="text-xs font-semibold">Pagar</span>
          </Link>
          <Link to="/add-money" className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600">
            <div className="bg-gray-100 p-3 rounded-full text-xl">💳</div>
            <span className="text-xs font-semibold">Ingresar</span>
          </Link>
          <Link to="/activity" className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600">
            <div className="bg-gray-100 p-3 rounded-full text-xl">📊</div>
            <span className="text-xs font-semibold">Actividad</span>
          </Link>
        </div>
      </div>

      {/* Últimas transacciones */}
      <div className="mx-auto w-full max-w-screen-sm px-4 py-8">
        <h3 className="font-bold text-gray-800 mb-4">Última actividad</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx: any) => (
              <div key={tx.id} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {tx.type === 'load' ? 'Ingreso de dinero' : tx.type === 'transfer' ? 'Transferencia' : 'Retiro'}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold ${tx.senderDni === user?.dni ? 'text-gray-900' : 'text-green-600'}`}>
                  {tx.senderDni === user?.dni ? '-' : '+'} {formatMoney(tx.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              Aún no tenés movimientos recientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}