import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react"; // 👈 type-only (verbatimModuleSyntax)
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  findAccount,
  clearLookup,
  getMyAccount,
} from "../features/account/accountSlice";
import {
  listTransactions,
  transfer,
} from "../features/transaction/transactionSlice";
import ConfirmModal from "../components/common/ConfirmModal";
import { toast } from "sonner";

const isCBU = (q: string) => /^\d{10,}$/.test(q);
const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    n
  );

export default function TransferPage() {
  const dispatch = useAppDispatch();

  const me = useAppSelector((s) => s.account.me);
  const { lookup, loading, error } = useAppSelector((s) => s.account);
  const txLoading = useAppSelector((s) => s.transaction.loading);

  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const saldo = Number(me?.balance ?? 0);
  const monto = typeof amount === "number" ? amount : 0;
  const faltaDestino = !lookup;
  const montoInvalido = !monto || monto <= 0;
  const sinSaldo = monto > saldo;

  const onLookup = async () => {
    if (!query.trim()) {
      toast.info("Ingresá un alias o CBU.");
      return;
    }
    const id = toast.loading("Buscando cuenta…");
    const r = await dispatch(findAccount(query.trim()));
    toast.dismiss(id);

    if (findAccount.fulfilled.match(r) && r.payload.account) {
      toast.success("Cuenta encontrada");
    } else if (findAccount.rejected.match(r)) {
      toast.error(r.payload || "No se pudo buscar la cuenta");
    } else {
      toast.error("Cuenta no encontrada");
    }
  };

  const onAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "") setAmount("");
    else setAmount(Number(v));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (faltaDestino) return toast.error("Primero buscá un destino");
    if (montoInvalido) return toast.error("Ingresá un monto válido");
    if (sinSaldo) return toast.error("Saldo insuficiente");
    setConfirmOpen(true);
  };

  const onConfirm = async () => {
    if (!lookup) return;
    setConfirmOpen(false);

    const payload = { to: isCBU(query) ? lookup.cbu : lookup.alias, amount: monto };
    const id = toast.loading("Enviando…");
    const r = await dispatch(transfer(payload));
    toast.dismiss(id);

    if (transfer.fulfilled.match(r)) {
      toast.success("Transferencia realizada ✅");
      setAmount("");
      setQuery("");
      dispatch(clearLookup());
      // refresco
      dispatch(getMyAccount());
      dispatch(listTransactions());
    } else {
      toast.error(r.payload || "Transferencia fallida");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <header className="rounded-xl bg-blue-600 p-4 text-white shadow">
        <p className="text-sm opacity-80">Saldo disponible</p>
        <p className="text-2xl font-semibold">$ {fmt(saldo)}</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-white p-4 shadow">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Alias o CBU
          </label>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ej: roro.mp.vw o 01701234…"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={onLookup}
              disabled={loading || !query.trim()}
              className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Buscar
            </button>
          </div>
          {lookup && (
            <p className="mt-2 text-sm text-gray-600">
              Destino: <span className="font-medium">{lookup.alias}</span>{" "}
              <span className="opacity-70">({lookup.cbu})</span>
            </p>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Monto
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={onAmountChange}
            placeholder="0,00"
            className="w-full rounded-lg border px-3 py-2 text-right text-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          {sinSaldo && (
            <p className="mt-2 text-sm text-red-600">Saldo insuficiente</p>
          )}
        </div>

        <button
          type="submit"
          disabled={txLoading || faltaDestino || montoInvalido || sinSaldo}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {txLoading ? "Enviando..." : "Transferir"}
        </button>
      </form>

      {/* Confirmación */}
      <ConfirmModal
        open={confirmOpen}
        title="Confirmar transferencia"
        description={
          <div className="space-y-1">
            <p>
              Destino: <span className="font-medium">{lookup?.alias}</span>
            </p>
            <p>
              CBU: <span className="font-mono">{lookup?.cbu}</span>
            </p>
            <p className="mt-2 text-lg">
              Monto: <span className="font-semibold">$ {fmt(monto)}</span>
            </p>
          </div>
        }
        confirmText="Enviar"
        cancelText="Cancelar"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
      />
    </div>
  );
}
