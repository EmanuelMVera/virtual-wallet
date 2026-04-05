import { useState, type FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/userSlice";
import { toast } from "sonner";

export default function LoginPage() {
  const location = useLocation() as any;
  const [email, setEmail] = useState(location.state?.identifier ?? "");
  const [password, setPassword] = useState("");
  const { loading } = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname ?? "/dashboard";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      toast.success("Bienvenido");
      navigate(from, { replace: true });
    } else {
      toast.error((result.payload as string) ?? "Login fallido");
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#fff9be] via-white to-white px-4 py-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h1 className="text-2xl font-black text-sky-900">Ingresá a tu cuenta</h1>
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-600">Email</label>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@dominio.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Contraseña</label>
              <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-60">
              {loading ? "Entrando…" : "Entrar"}
            </button>
            <p className="text-sm text-gray-500">¿No tenés cuenta? <Link to="/register" className="text-blue-700 font-semibold">Crear cuenta</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}