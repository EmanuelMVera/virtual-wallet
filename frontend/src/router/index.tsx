import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../app/hooks";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import TransferPage from "../pages/TransferPage";

type PrivateProps = { children: ReactNode };

function Private({ children }: PrivateProps) {
  const token = useAppSelector((s) => s.auth.token);
  return token ? <>{children}</> : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/transfer" element={<Private><TransferPage /></Private>} />
      </Routes>
    </BrowserRouter>
  );
}
