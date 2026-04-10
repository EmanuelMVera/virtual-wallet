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

  useEffect(() => {
    if (history.length === 0) dispatch(fetchHistory());
  }, [dispatch, history.length]);

  const recentContacts = useMemo(() => {
    const contacts = new Map();
    history.forEach((tx: any) => {
      if (tx.type === 'transfer' && tx.senderId === user?.id && tx.receiver) {
        const { alias, firstName, lastName } = tx.receiver;
        if (alias && !contacts.has(alias)) contacts.set(alias, `${firstName} ${lastName}`);
      }
    });
    return Array.from(contacts.entries()).map(([alias, fullName]) => ({ alias, fullName })).slice(0, 5);
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
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Transferir dinero</h1>
        <p className="page-subtitle mt-1">Enviá plata al instante usando el alias del destinatario.</p>
      </div>

      {recentContacts.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Contactos recientes</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recentContacts.map((contact) => (
              <button key={contact.alias} onClick={() => setTargetAlias(contact.alias)} className="min-w-[90px] rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center transition hover:bg-blue-50">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">{contact.fullName.charAt(0).toUpperCase()}</div>
                <p className="mt-2 truncate text-xs font-semibold text-slate-700">{contact.fullName}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Alias destino</label>
          <input value={targetAlias} onChange={(e) => setTargetAlias(e.target.value)} placeholder="Ej: ana.perez" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Monto a transferir</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-500 font-semibold">$</span>
            <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-slate-300 py-3 pl-8 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
          </div>
        </div>
        <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Procesando...' : 'Transferir ahora'}
        </button>
      </form>
    </div>
  );
}
