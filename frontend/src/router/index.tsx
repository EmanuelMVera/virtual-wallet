import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import RequireAuth from './RequireAuth';

// Páginas Públicas
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Páginas Privadas
import Dashboard from '../pages/Dashboard';
import ProfilePage from '../pages/ProfilePage';

// Importaciones futuras (para los botones del Dashboard)
// import TransferPage from '../pages/TransferPage';
// import AddMoneyPage from '../pages/AddMoneyPage';
// import ActivityPage from '../pages/ActivityPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas (Envueltas en layout y protección de sesión) */}
        <Route 
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Rutas pendientes de implementar desde el Dashboard */}
          {/* <Route path="/transfer" element={<TransferPage />} /> */}
          {/* <Route path="/add-money" element={<AddMoneyPage />} /> */}
          {/* <Route path="/activity" element={<ActivityPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}