import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getMe } from "./features/userSlice";
import AppRouter from "./router";
import { Toaster } from "sonner";

export default function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.user.token);

  useEffect(() => {
    // Si hay un token guardado, recuperamos los datos del usuario al arrancar
    if (token) dispatch(getMe());
  }, [token, dispatch]);

  return (
    <>
      <AppRouter />
      <Toaster 
        richColors 
        position="top-right" 
        closeButton 
      />
    </>
  );
}