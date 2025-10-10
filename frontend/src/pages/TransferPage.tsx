import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearLookup, getMyAccount } from "../features/account/accountSlice";
import {
  listTransactions,
  transfer,
} from "../features/transaction/transactionSlice";
import ConfirmModal from "../components/common/ConfirmModal";
import { toast } from "sonner";
import { useRecentRecipients } from "../hooks/useRecentRecipients";
import InlineSearch from "../components/transfer/InlineSearch";

const isCBU = (q: string) => /^\d{10,}$/.test(q);
const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export default function TransferPage() {
  const dispatch = useAppDispatch();

  const me = useAppSelector((s) => s.account.me);
  const { lookup, error } = useAppSelector((s) => s.account);
  const txLoading = useAppSelector((s) => s.transaction.loading);

  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const saldo = Number(me?.balance ?? 0);
  const monto = typeof amount === "number" ? amount : 0;
  const faltaDestino = !lookup;
  const montoInvalido = !monto || monto <= 0;
  const sinSaldo = monto > saldo;

  // recientes
  const { getAll, add } = useRecentRecipients();
  const recents = getAll();

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

      // guardar “reciente”
      add({
        alias: lookup.alias,
        cbu: lookup.cbu,
        label: lookup.alias ?? lookup.cbu ?? "Destino",
      });

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

          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ej: roro.mp.vw o 01701234…"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            <InlineSearch
              value={query}
              onPick={(val) => setQuery(val)}
            />
          </div>

          {/* recientes */}
          {recents.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {recents.map((r, i) => (
                <button
                  key={`${r.label}-${i}`}
                  type="button"
                  onClick={() => setQuery(r.alias ?? r.cbu ?? "")}
                  className="rounded-full border bg-white px-3 py-1 text-sm hover:shadow"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {lookup && (
            <p className="mt-2 text-sm text-gray-600">
              Destino: <span className="font-medium">{lookup.alias ?? lookup.cbu}</span>
              {lookup.alias && lookup.cbu && (
                <span className="opacity-70"> ({lookup.cbu})</span>
              )}
            </p>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Monto
          </label>
        </div>
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
              Destino:{" "}
              <span className="font-medium">
                {lookup?.alias ?? lookup?.cbu}
              </span>
            </p>
            {lookup?.cbu && (
              <p>
                CBU: <span className="font-mono">{lookup.cbu}</span>
              </p>
            )}
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
