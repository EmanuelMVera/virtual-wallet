interface BalanceCardProps {
  balance: number;
  title?: string;
}

export default function BalanceCard({ balance, title = "Saldo disponible" }: BalanceCardProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative">
        <p className="text-sm font-medium opacity-90 mb-2 flex items-center gap-2">
          <span className="text-lg">💰</span>
          {title}
        </p>
        <p className="text-3xl font-bold tracking-tight">$ {fmt(balance)}</p>
        <div className="mt-3 flex items-center gap-1 text-xs opacity-75">
          <span>Disponible para transferir</span>
        </div>
      </div>
    </div>
  );
}