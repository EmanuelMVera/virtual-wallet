import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useMemo } from "react";
import { getMyAccount } from "../../features/account/accountSlice";

export default function AppShell() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const acc = useAppSelector((s) => s.account.me);

  useEffect(() => {
    if (!acc) dispatch(getMyAccount());
  }, [acc, dispatch]);

  const money = useMemo(
    () =>
      acc
        ? new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
          }).format(Number(acc.balance))
        : "—",
    [acc]
  );

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      {/* header */}
      <header className="px-4 py-3 bg-blue-600 text-white shadow">
        <div className="text-xs opacity-80">Saldo disponible</div>
        <div className="text-2xl font-semibold">{money}</div>
      </header>

      {/* contenido centrado mobile + espacio para la bottom bar */}
      <main className="flex-1 p-4 pb-20 mx-auto w-full max-w-screen-sm">
        <Outlet />
      </main>

      {/* bottom nav */}
      <nav className="sticky bottom-0 bg-white border-t">
        <ul className="mx-auto w-full max-w-screen-sm grid grid-cols-5 text-sm">
          {[
            { to: "/dashboard", label: "Inicio" },
            { to: "/activity", label: "Mov." },
            { to: "/pay", label: "Pagar" },
            { to: "/add-money", label: "Recargar" },
            { to: "/profile", label: "Perfil" },
          ].map((i) => (
            <li key={i.to} className="text-center">
              <NavLink
                to={i.to}
                className={({ isActive }) =>
                  `block py-2 ${isActive || pathname.startsWith(i.to)
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"}`
                }
              >
                {i.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
