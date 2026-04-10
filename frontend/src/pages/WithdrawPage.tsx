import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { withdraw, fetchHistory } from '../features/transactionSlice';
import { getMe } from '../features/userSlice';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.transaction.loading);
  const [amount, setAmount] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(withdraw(Number(amount)));

    if (withdraw.fulfilled.match(result)) {
      toast.success('Retiro realizado');
      setAmount('');
      dispatch(getMe());
      dispatch(fetchHistory());
      return;
    }

    toast.error((result.payload as string) ?? 'No se pudo retirar dinero');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="page-title">Retirar dinero</h1>
        <p className="page-subtitle mt-1">Retirá saldo de tu cuenta de forma segura.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 max-w-xl">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Monto</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
        </div>
        <button disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
          {loading ? 'Procesando…' : 'Confirmar retiro'}
        </button>
      </form>
    </div>
  );
}
