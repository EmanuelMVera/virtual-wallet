import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect } from 'react';
import { getMe } from '../../features/userSlice';
import { formatMoney } from '../../utils/format';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Inicio', icon: '🏠' },
  { to: '/activity', label: 'Movimientos', icon: '📊' },
  { to: '/transfer', label: 'Transferir', icon: '💸' },
  { to: '/add-money', label: 'Ingresar', icon: '➕' },
  { to: '/withdraw', label: 'Retirar', icon: '🏧' },
  { to: '/profile', label: 'Perfil', icon: '👤' },
];

export default function AppShell() {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((s) => s.user);

  useEffect(() => {
    if (!user && token) dispatch(getMe());
  }, [user, token, dispatch]);

  return (
    <div className="min-h-dvh md:p-4">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1300px] overflow-hidden rounded-none border border-slate-200/70 bg-white/70 shadow-2xl shadow-blue-100/40 md:min-h-[92vh] md:rounded-3xl">
        <aside className="hidden md:flex md:w-72 md:flex-col md:border-r md:border-slate-200/80 md:bg-slate-900 md:text-slate-100">
          <div className="border-b border-slate-800 px-6 py-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Virtual Wallet</p>
            <h2 className="mt-1 text-2xl font-black">Mi cuenta</h2>
            <p className="mt-4 text-xs text-slate-400">Saldo disponible</p>
            <p className="text-2xl font-bold text-cyan-300">{formatMoney(user?.balance ?? 0)}</p>
          </div>

          <nav className="flex-1 px-4 py-5">
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="soft-glass sticky top-0 z-20 border-b border-slate-200/80 px-4 py-3 md:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Panel financiero</p>
                <p className="text-sm font-semibold text-slate-700">Gestioná tu dinero con una vista clara</p>
              </div>
              <div className="rounded-xl bg-blue-50 px-3 py-2 text-right">
                <p className="text-xs text-slate-500">Disponible</p>
                <p className="text-sm font-bold text-blue-700">{formatMoney(user?.balance ?? 0)}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="page-shell pb-24 md:pb-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <nav className="soft-glass fixed bottom-3 left-3 right-3 z-30 rounded-2xl border border-slate-200/80 p-1.5 shadow-xl md:hidden">
        <ul className="grid grid-cols-6 gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-xl px-1 py-2 text-[11px] font-semibold transition ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
