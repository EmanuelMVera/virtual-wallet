import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import RequireAuth from "./RequireAuth";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import TransferPage from "../pages/TransferPage";
import PayHubPage from "../pages/PayHubPage";
import ActivityPage from "../pages/ActivityPage";
import AddMoneyPage from "../pages/AddMoneyPage";
import ProfilePage from "../pages/ProfilePage";
// import Placeholder from "../pages/Placeholder";

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
          <Route path="/add-money" element={<AddMoneyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
