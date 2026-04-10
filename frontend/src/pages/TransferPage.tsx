import { FormEvent, useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { transfer, fetchHistory } from '../features/transactionSlice';
import { getMe } from '../features/userSlice';
import { toast } from 'sonner';

export default function TransferPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.transaction.loading);
  const history = useAppSelector((s) => s.transaction.history);
  const user = useAppSelector((s) => s.user.user);
  
  const [targetAlias, setTargetAlias] = useState('');
  const [amount, setAmount] = useState('');

  // Cargar historial si está vacío para obtener contactos
  useEffect(() => {
    if (history.length === 0) dispatch(fetchHistory());
  }, [dispatch, history.length]);

  // Extraer contactos únicos del historial
  const recentContacts = useMemo(() => {
    const contacts = new Map();
    history.forEach((tx: any) => {
      // Si yo envié la transferencia, guardo al receptor
      if (tx.type === 'transfer' && tx.senderId === user?.id && tx.receiver) {
        const { alias, firstName, lastName } = tx.receiver;
        if (alias && !contacts.has(alias)) {
          contacts.set(alias, `${firstName} ${lastName}`);
        }
      }
    });
   return Array.from(contacts.entries())
      .map(([alias, fullName]) => ({ alias, fullName }))
      .slice(0, 5);
  }, [history, user]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(transfer({ targetAlias, amount: Number(amount) }));

    if (transfer.fulfilled.match(result)) {
      toast.success('Transferencia realizada exitosamente');
      setAmount('');
      setTargetAlias('');
      dispatch(getMe());
      dispatch(fetchHistory());
      return;
    }
    toast.error((result.payload as string) ?? 'No se pudo transferir');
  };

  return (
    <div className="mx-auto max-w-screen-sm p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Transferir dinero</h1>
      
      {recentContacts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Contactos recientes</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentContacts.map((contact) => (
              <button 
                key={contact.alias} 
                onClick={() => setTargetAlias(contact.alias)} // Completa con el ALIAS
                className="flex flex-col items-center gap-1 min-w-[70px] hover:opacity-80 transition"
              >
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200">
                  {contact.fullName.charAt(0).toUpperCase()}
                </div>
                {/* Muestra Nombre y Apellido */}
                <span className="text-xs font-medium text-gray-700 truncate w-16 text-center">{contact.fullName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Alias destino</label>
          <input 
            value={targetAlias} 
            onChange={(e) => setTargetAlias(e.target.value)} 
            placeholder="Ej: emanuel.vera"
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition" 
            required 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Monto a transferir</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 font-medium">$</span>
            <input 
              type="number" min="0.01" step="0.01" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-lg p-3 pl-8 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition" 
              required 
            />
          </div>
        </div>
        <button disabled={loading} className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Procesando...' : 'Transferir'}
        </button>
      </form>
    </div>
  );
}