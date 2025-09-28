import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import RequireAuth from './RequireAuth';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import TransferPage from '../pages/TransferPage';
import Placeholder from '../pages/Placeholder';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route
          path="/"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* privadas (envueltas en AppShell) */}
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/pay"
            element={<TransferPage />}
          />

          {/* placeholders para completar luego */}
          {/* y crear rutas protegidas a /activity, /pay, /add-money, /profile */}
          <Route
            path="/activity"
            element={<Placeholder title="Actividad" />}
          />
          <Route
            path="/add-money"
            element={<Placeholder title="Agregar dinero" />}
          />
          <Route
            path="/profile"
            element={<Placeholder title="Perfil" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
