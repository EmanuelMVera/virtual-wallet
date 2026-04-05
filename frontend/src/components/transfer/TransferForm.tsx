import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { transfer } from "../../features/transactionSlice";
import { useTransfer } from "../../hooks/useTransaction";
import { useAccount } from "../../hooks/useAccount";
import Card from "../ui/Card";
import InlineSearch from "./InlineSearch";
import ConfirmModal from "../common/ConfirmModal";
import { toast } from "sonner";

const isCBU = (q: string) => /^\d{10,}$/.test(q);

interface TransferFormProps {
  onSuccess?: () => void;
}

export default function TransferForm({ onSuccess }: TransferFormProps) {
  const { executeTransfer, loading } = useTransfer();
  const { account, searchResult, searchAccount } = useAccount();

  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const saldo = Number(account?.balance ?? 0);
  const monto = typeof amount === "number" ? amount : 0;
  const faltaDestino = !searchResult;
  const montoInvalido = !monto || monto <= 0;
  const sinSaldo = monto > saldo;

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
    if (!searchResult) return;
    setConfirmOpen(false);

    const payload = { to: isCBU(query) ? searchResult.cbu : searchResult.alias, amount: monto };
    const id = toast.loading("Enviando…");
    const result = await executeTransfer(payload);
    toast.dismiss(id);

    if (transfer.fulfilled.match(result)) {
      toast.success("Transferencia realizada ✅");
      setAmount("");
      setQuery("");
      onSuccess?.();
    } else {
      toast.error(result.payload || "Transferencia fallida");
    }
  };

  return (
    <>
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-lg">👤</span>
              Destinatario
            </label>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Alias o CBU del destinatario"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                autoComplete="off"
              />
              <InlineSearch
                query={query}
                onQueryChange={setQuery}
                onSearch={searchAccount}
                result={searchResult}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-lg">💰</span>
              Monto a transferir
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={onAmountChange}
                className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="0.00"
              />
            </div>
            {sinSaldo && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span>
                Saldo insuficiente
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || faltaDestino || montoInvalido || sinSaldo}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-white font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Enviando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>📤</span>
                Transferir dinero
              </span>
            )}
          </button>
        </form>
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        title="Confirmar Transferencia"
        description={`¿Enviar $${monto} a ${searchResult?.alias || searchResult?.cbu}?`}
      />
    </>
  );
}