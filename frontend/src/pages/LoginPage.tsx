import { useState, type FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/userSlice";
import { toast } from "sonner";

export default function LoginPage() {
  const location = useLocation() as any;
  const [email, setEmail] = useState(location.state?.identifier ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      toast.error((result.payload as string) ?? "Login fallido. Verificá tus credenciales.");
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#f7f8fa] via-white to-white text-gray-800">
      {/* Header Auth */}
      <header className="border-b border-gray-200 bg-[#fff200] px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white">M</div>
            <span className="font-black text-gray-900">mercado pago</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-blue-700 hover:underline">Volver al inicio</Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-lg border border-gray-100">
          <h1 className="text-2xl font-black text-sky-900 text-center mb-6">Ingresá a tu cuenta</h1>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input required type="email" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@dominio.com" />
            </div>
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
              <input required type={showPassword ? "text" : "password"} className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-gray-500 hover:text-gray-700">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-sm text-gray-600">¿No tenés cuenta? <Link to="/register" className="font-bold text-blue-700 hover:underline">Crear cuenta</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}