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
    if (tx.type === 'load' || tx.type === 'deposit') return { title: 'Ingreso', sign: '+', color: 'text-green-600' };
    if (tx.type === 'withdraw') return { title: 'Retiro', sign: '-', color: 'text-gray-900' };
    
    if (isSender) {
      const r = tx.receiver;
      // Mostramos Nombre, Apellido y Alias entre paréntesis para ser descriptivos
      const displayName = r ? `${r.firstName} ${r.lastName} (${r.alias})` : 'Usuario';
      return { title: `A ${displayName}`, sign: '-', color: 'text-red-500' };
    } else {
      const s = tx.sender;
      const displayName = s ? `${s.firstName} ${s.lastName} (${s.alias})` : 'Usuario';
      return { title: `De ${displayName}`, sign: '+', color: 'text-green-600' };
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pb-10">
      <div className="bg-[#009EE3] text-white pt-8 pb-16 px-4">
        <div className="mx-auto max-w-screen-sm">
          <p className="text-sm font-medium opacity-90">Dinero disponible</p>
          <h2 className="text-4xl font-bold mt-1 tracking-tight">{user ? formatMoney(user.balance) : '...'}</h2>
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-sm px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-4 gap-2 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <Link to="/transfer" className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <div className="bg-gray-50 hover:bg-blue-50 p-3 rounded-full text-2xl transition">💸</div>
            <span className="text-xs font-semibold">Transferir</span>
          </Link>
          <Link to="/add-money" className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <div className="bg-gray-50 hover:bg-blue-50 p-3 rounded-full text-2xl transition">💳</div>
            <span className="text-xs font-semibold">Ingresar</span>
          </Link>
          <Link to="/withdraw" className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <div className="bg-gray-50 hover:bg-blue-50 p-3 rounded-full text-2xl transition">🏧</div>
            <span className="text-xs font-semibold">Retirar</span>
          </Link>
          <Link to="/activity" className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <div className="bg-gray-50 hover:bg-blue-50 p-3 rounded-full text-2xl transition">📊</div>
            <span className="text-xs font-semibold">Actividad</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-sm px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Última actividad</h3>
          <Link to="/activity" className="text-sm font-semibold text-blue-600 hover:underline">Ver todo</Link>
        </div>
        
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {history.length > 0 ? (
            history.slice(0, 5).map((tx) => {
              const { title, sign, color } = getTransactionDetails(tx);
              return (
                <div key={tx.id} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <span className={`font-bold tracking-tight ml-4 ${color}`}>
                    {sign} {formatMoney(tx.amount)}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center flex flex-col items-center">
              <span className="text-3xl mb-2">📭</span>
              <p className="text-gray-800 font-medium">Aún no hay actividad</p>
              <p className="text-gray-500 text-sm mt-1">Tus últimos movimientos aparecerán acá.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}