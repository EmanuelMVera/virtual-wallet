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
    <div className="mx-auto max-w-screen-sm p-4">
      <h1 className="text-2xl font-bold mb-4">Retirar dinero</h1>
      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <label className="text-sm text-gray-600">Monto</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border rounded-lg p-2" required />
        </div>
        <button disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-60">
          {loading ? 'Procesando…' : 'Retirar'}
        </button>
      </form>
    </div>
  );
}
