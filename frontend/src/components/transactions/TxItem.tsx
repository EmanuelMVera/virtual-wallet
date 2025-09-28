import type { Transaction } from "../../types";
import { formatMoney, formatRelative } from "../../utils/format";

type Props = { tx: Transaction; myAccountId?: number };

export default function TxItem({ tx, myAccountId }: Props) {
  const isOutgoing = tx.senderAccountId === myAccountId && tx.type !== "deposit";
  const sign = isOutgoing ? "-" : "+";
  const color = isOutgoing ? "text-red-600" : "text-emerald-600";
  const label =
    tx.type === "deposit" ? "Depósito" :
    isOutgoing ? `Enviado` : `Recibido`;

  return (
    <li className="flex items-center justify-between py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
        <p className="text-xs text-gray-500">{formatRelative(tx.timestamp)}</p>
      </div>
      <div className={"ml-4 text-sm font-semibold " + color}>
        {sign} {formatMoney(tx.amount)}
      </div>
    </li>
  );
}
