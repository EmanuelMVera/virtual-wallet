import { Link, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function AppShell() {
  const { pathname } = useLocation();
  const acc = useAppSelector((s) => s.account.me);

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      <header className="px-4 py-3 bg-blue-600 text-white shadow">
        <div className="text-xs opacity-80">Saldo disponible</div>
        <div className="text-2xl font-semibold">
          {acc ? `$ ${Number(acc.balance).toFixed(2)}` : "—"}
        </div>
      </header>

      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <nav className="sticky bottom-0 bg-white border-t">
        <ul className="grid grid-cols-5 text-sm">
          {[
            { to: "/dashboard", label: "Inicio" },
            { to: "/activity", label: "Mov." },
            { to: "/pay", label: "Pagar" },
            { to: "/add-money", label: "Recargar" },
            { to: "/profile", label: "Perfil" },
          ].map((i) => (
            <li key={i.to} className="text-center">
              <Link
                to={i.to}
                className={`block py-2 ${pathname === i.to ? "text-blue-600 font-medium" : "text-gray-600"}`}
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
