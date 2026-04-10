import { useState, type FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/userSlice';
import { toast } from 'sonner';

export default function LoginPage() {
  const location = useLocation() as any;
  const [email, setEmail] = useState(location.state?.identifier ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname ?? '/dashboard';

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      toast.success('Bienvenido');
      navigate(from, { replace: true });
    } else {
      toast.error((result.payload as string) ?? 'Login fallido. Verificá tus credenciales.');
    }
  };

  return (
    <div className="min-h-dvh px-4 py-8">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-2xl shadow-blue-100/40 md:grid-cols-2">
        <section className="hidden bg-slate-900 p-10 text-white md:block">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-200 hover:text-white">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-500 font-bold">VW</span>
            <span className="font-bold">Virtual Wallet</span>
          </Link>
          <h1 className="mt-8 text-4xl font-black leading-tight">Bienvenido de nuevo.</h1>
          <p className="mt-3 text-slate-300">Entrá para ver tu saldo, mover dinero y gestionar tu perfil en una interfaz más clara y rápida.</p>
        </section>

        <section className="p-6 sm:p-10">
          <h2 className="text-2xl font-black text-slate-900">Ingresá a tu cuenta</h2>
          <p className="mt-1 text-sm text-slate-500">Tus datos están protegidos con cifrado seguro.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input required type="email" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@dominio.com" />
            </div>
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
              <input required type={showPassword ? 'text' : 'password'} className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-slate-500 hover:text-slate-700">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="font-bold text-blue-700 hover:underline">
              Crear cuenta
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
