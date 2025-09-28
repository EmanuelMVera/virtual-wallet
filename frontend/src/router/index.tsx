import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import RequireAuth from "./RequireAuth";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import TransferPage from "../pages/TransferPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* privadas (envueltas en AppShell) */}
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pay" element={<TransferPage />} />

          {/* placeholders para completar luego */}
          <Route path="/activity" element={<div>Activity</div>} />
          <Route path="/add-money" element={<div>Agregar dinero</div>} />
          <Route path="/profile" element={<div>Perfil</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
