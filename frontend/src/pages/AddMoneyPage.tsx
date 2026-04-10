import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { deposit, fetchHistory } from '../features/transactionSlice';
import { getMe } from '../features/userSlice';
import { toast } from 'sonner';

export default function AddMoneyPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.transaction.loading);
  const [amount, setAmount] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(deposit(Number(amount)));

    if (deposit.fulfilled.match(result)) {
      toast.success('Dinero ingresado');
      setAmount('');
      dispatch(getMe());
      dispatch(fetchHistory());
      return;
    }

    toast.error((result.payload as string) ?? 'No se pudo ingresar dinero');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="page-title">Ingresar dinero</h1>
        <p className="page-subtitle mt-1">Cargá saldo para usarlo en transferencias y pagos.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 max-w-xl">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Monto</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
        </div>
        <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Procesando…' : 'Ingresar fondos'}
        </button>
      </form>
    </div>
  );
}
