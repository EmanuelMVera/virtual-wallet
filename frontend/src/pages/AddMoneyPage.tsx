import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  listBankAccounts,
  depositFromBank,
  registerBankAccount,
} from "../features/bankAccount/bankAccountSlice";
import { getMyAccount } from "../features/account/accountSlice";
import { listTransactions } from "../features/transaction/transactionSlice";
import { toast } from "sonner";

export default function AddMoneyPage() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.bankAccount);
  const myAccount = useAppSelector((s) => s.account.me);

  // depósito
  const [bankAccountId, setBankAccountId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);

  // vinculación de cuenta
  const [showForm, setShowForm] = useState(false);
  const [bn, setBn] = useState(""); // bankName
  const [num, setNum] = useState(""); // accountNumber
  const [bal, setBal] = useState(0);  // saldo inicial opcional

  useEffect(() => {
    dispatch(listBankAccounts());
    if (!myAccount) dispatch(getMyAccount());
  }, [dispatch, myAccount]);

  // Depositar desde banco -> cuenta virtual
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bankAccountId || amount <= 0) return;

    const id = toast.loading("Procesando depósito…");
    const r = await dispatch(depositFromBank({ bankAccountId, amount }));
    toast.dismiss(id);

    if (depositFromBank.fulfilled.match(r)) {
      toast.success("Depósito realizado");
      setAmount(0);
      setBankAccountId(null);
      // refrescar saldo y movimientos
      dispatch(getMyAccount());
      dispatch(listTransactions());
      dispatch(listBankAccounts());
    } else {
      toast.error((r.payload as string) ?? "No se pudo realizar el depósito");
    }
  };

  // Registrar (vincular) una cuenta bancaria
  const onRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!bn.trim() || !num.trim()) return toast.error("Completá los datos");

    const id = toast.loading("Vinculando cuenta…");
    const r = await dispatch(
      registerBankAccount({ bankName: bn.trim(), accountNumber: num.trim(), balance: bal })
    );
    toast.dismiss(id);

    if (registerBankAccount.fulfilled.match(r)) {
      toast.success("Cuenta vinculada");
      setShowForm(false);
      setBn(""); setNum(""); setBal(0);
      dispatch(listBankAccounts());
    } else {
      toast.error((r.payload as string) ?? "No se pudo vincular la cuenta");
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
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <p className="text-sm text-gray-700">
            No tenés cuentas bancarias vinculadas.
          </p>

          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-blue-600 text-white px-3 py-2 text-sm"
            >
              Vincular cuenta
            </button>
          ) : (
            <form onSubmit={onRegister} className="space-y-3">
              <input
                className="w-full rounded-xl border bg-white px-3 py-2 shadow-sm"
                placeholder="Banco"
                value={bn}
                onChange={(e) => setBn(e.target.value)}
              />
              <input
                className="w-full rounded-xl border bg-white px-3 py-2 shadow-sm"
                placeholder="Número de cuenta"
                value={num}
                onChange={(e) => setNum(e.target.value)}
              />
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border bg-white px-3 py-2 shadow-sm"
                placeholder="Saldo inicial (opcional)"
                value={bal}
                onChange={(e) => setBal(Number(e.target.value))}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 text-white px-3 py-2 text-sm"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 rounded-xl border bg-white p-4 shadow-sm">
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
            disabled={loading || !bankAccountId || amount <= 0}
            className="w-full rounded-xl bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Depositar
          </button>
        </form>
      )}
    </div>
  );
}
