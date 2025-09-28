import { useState, type FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/auth/authSlice";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };
  const from = (location.state?.from as any)?.pathname ?? "/dashboard";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const r = await dispatch(login({ email, password }));
    if (login.fulfilled.match(r)) {
      toast.success("Bienvenido");
      navigate(from, { replace: true });
    } else {
      toast.error((r.payload as string) ?? "Login fallido");
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Ingresar</h1>

        <label className="mb-2 block text-sm text-gray-600">Email</label>
        <input className="mb-3 w-full rounded-lg border px-3 py-2 focus:outline-none focus:border-blue-500"
               value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@dominio.com" />

        <label className="mb-2 block text-sm text-gray-600">Contraseña</label>
        <input type="password" className="mb-4 w-full rounded-lg border px-3 py-2 focus:outline-none focus:border-blue-500"
               value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" />

        <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60">
          {loading ? "Entrando…" : "Entrar"}
        </button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-3 text-sm text-gray-600">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-600">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
