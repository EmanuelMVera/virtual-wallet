import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import RequireAuth from './RequireAuth';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import ProfilePage from '../pages/ProfilePage';
import ActivityPage from '../pages/ActivityPage';
import TransferPage from '../pages/TransferPage';
import AddMoneyPage from '../pages/AddMoneyPage';
import WithdrawPage from '../pages/WithdrawPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/add-money" element={<AddMoneyPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
