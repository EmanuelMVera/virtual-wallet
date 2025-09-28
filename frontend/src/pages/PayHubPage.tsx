import { Link } from "react-router-dom";

type Item =
  | { label: string; to: string; hint?: string; disabled?: false }
  | { label: string; hint?: string; disabled: true };

export default function PayHubPage() {
  const items: Item[] = [
    { label: "Pagar con QR", hint: "Próximamente", disabled: true },
    { label: "Transferir", to: "/transfer" },
    { label: "Servicios", hint: "Próximamente", disabled: true },
    { label: "Cobrar", hint: "Próximamente", disabled: true },
  ];

  return (
    <div className="mx-auto max-w-md p-4 space-y-4">
      <h1 className="text-xl font-semibold">Pagar</h1>

      <div className="grid grid-cols-2 gap-3">
        {items.map((it) =>
          "to" in it && !it.disabled ? (
            <Link
              key={it.label}
              to={it.to}
              className="rounded-xl border bg-white p-4 text-center shadow-sm hover:shadow transition"
            >
              <div className="text-base font-medium">{it.label}</div>
              {it.hint && (
                <div className="text-xs text-gray-500 mt-1">{it.hint}</div>
              )}
            </Link>
          ) : (
            <div
              key={it.label}
              className="rounded-xl border bg-white p-4 text-center shadow-sm opacity-50 pointer-events-none"
              aria-disabled="true"
            >
              <div className="text-base font-medium">{it.label}</div>
              {it.hint && (
                <div className="text-xs text-gray-500 mt-1">{it.hint}</div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
