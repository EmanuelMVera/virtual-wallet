import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { listBankAccounts, depositFromBank } from "../features/bankAccount/bankAccountSlice";
import { getMyAccount } from "../features/account/accountSlice";
import { listTransactions } from "../features/transaction/transactionSlice";
import { toast } from "sonner";

export default function AddMoneyPage() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.bankAccount);
  const myAccount = useAppSelector((s) => s.account.me);

  const [bankAccountId, setBankAccountId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    dispatch(listBankAccounts());
    if (!myAccount) dispatch(getMyAccount());
  }, [dispatch, myAccount]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!myAccount?.id || !bankAccountId || amount <= 0) return;

    const r = await dispatch(
      depositFromBank({ bankAccountId, walletAccountId: myAccount.id, amount })
    );

    if (depositFromBank.fulfilled.match(r)) {
      toast.success("Depósito realizado");
      setAmount(0);
      // refrescar saldo y movimientos
      dispatch(getMyAccount());
      dispatch(listTransactions());
    } else {
      toast.error(
        (r.payload as string) ?? "No se pudo realizar el depósito"
      );
    }
  };

  if (loading && list.length === 0) {
    return <div className="p-4">Cargando cuentas bancarias…</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-700 bg-red-50 border rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-sm p-4 space-y-4">
      <h1 className="text-xl font-semibold">Agregar dinero</h1>

      {list.length === 0 ? (
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-700">
            No tenés cuentas bancarias vinculadas.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Próximamente: vinculación de cuenta bancaria desde la app.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Cuenta bancaria
            </label>
            <select
              value={bankAccountId ?? ""}
              onChange={(e) => setBankAccountId(Number(e.target.value))}
              className="w-full rounded-xl border bg-white px-3 py-2 shadow-sm"
            >
              <option value="" disabled>
                Seleccioná una cuenta
              </option>
              {list.map((ba) => (
                <option key={ba.id} value={ba.id}>
                  {ba.bankName} · {ba.accountNumber} (saldo {ba.balance})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Monto</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border bg-white px-3 py-2 shadow-sm"
              placeholder="0"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !bankAccountId || amount <= 0 || !myAccount?.id}
            className="w-full rounded-xl bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Depositar
          </button>
        </form>
      )}
    </div>
  );
}
