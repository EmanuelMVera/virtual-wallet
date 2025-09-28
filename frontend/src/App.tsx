import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { me } from "./features/auth/authSlice";
import AppRouter from "./router";
import { Toaster } from "sonner";

export default function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);

  useEffect(() => {
    if (token) dispatch(me());
  }, [token, dispatch]);

  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-center" />
    </>
  );
}
