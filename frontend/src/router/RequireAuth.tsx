import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../app/hooks";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);
  const location = useLocation();
  if (!token) return <Navigate to="/" replace state={{ from: location }} />;
  return <>{children}</>;
}
