import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import RequireAuth from "./RequireAuth";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import TransferPage from "../pages/TransferPage";
import Placeholder from "../pages/Placeholder";
import PayHubPage from "../pages/PayHubPage";
import ActivityPage from "../pages/ActivityPage";

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
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/pay" element={<PayHubPage />} />
          <Route path="/activity" element={<ActivityPage />} />

          {/* placeholders para completar luego */}
          <Route path="/add-money" element={<Placeholder title="Agregar dinero" />} />
          <Route path="/profile" element={<Placeholder title="Perfil" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
