import type { Transaction } from "../../types";

/** Dirección: true = entrada, false = salida */
function isIncoming(tx: Transaction, myAccountId?: number | null) {
  // Casos explícitos (por si en algún momento el back devuelve estos)
  if (tx.type === "transfer_in") return true as const;
  if (tx.type === "transfer_out") return false as const;

  // Caso actual de tu back: "deposit" y "transfer"
  if (tx.type === "deposit") return true as const;

  if (tx.type === "transfer") {
    if (!myAccountId) return false as const;
    if (tx.receiverAccountId === myAccountId) return true as const;
    if (tx.senderAccountId === myAccountId) return false as const;
  }
  return false as const;
}

function label(tx: Transaction, incoming: boolean) {
  if (tx.type === "deposit") return "Depósito";
  if (tx.type === "transfer") return incoming ? "Recibido" : "Enviado";
  if (tx.type === "transfer_in") return "Recibido";
  if (tx.type === "transfer_out") return "Enviado";
  return tx.type;
}

function money(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(n);
}

function when(ts?: string) {
  // Evita error si viniera undefined
  const d = ts ? new Date(ts) : new Date();
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "justo ahora";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  return d.toLocaleDateString();
}

export default function TxItem({
  tx,
  myAccountId,
}: {
  tx: Transaction;
  myAccountId?: number | null;
}) {
  const incoming = isIncoming(tx, myAccountId);

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm">
      <div>
        <div className="text-sm font-medium">{label(tx, incoming)}</div>
        <div className="text-xs text-gray-500">{when(tx.timestamp)}</div>
      </div>
      <div
        className={`text-sm font-semibold ${
          incoming ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {incoming ? "+ " : "- "}
        {money(tx.amount)}
      </div>
    </div>
  );
}
