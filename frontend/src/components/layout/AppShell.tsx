import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect } from 'react';
import { getMe } from '../../features/userSlice';

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
    if (!user && token) {
      dispatch(getMe());
    }
  }, [user, token, dispatch]);

  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-gray-50">
      {/* <header className="px-4 py-3 bg-blue-600 text-white shadow-md md:px-6 md:py-4">
        <div className="text-xs opacity-80 md:text-sm">Saldo disponible</div>
      </header> */}

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shadow-sm">
          <nav className="flex-1 py-6 px-3">
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm md:text-base">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <ul className="grid grid-cols-6 gap-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-800'
                  }`
                }
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="truncate max-w-[60px]">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
