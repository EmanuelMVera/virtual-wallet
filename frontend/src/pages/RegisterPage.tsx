import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'sonner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dni: '', firstName: '', lastName: '', phone: '',
    email: '', confirmEmail: '',
    password: '', confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.email !== formData.confirmEmail) return toast.error('Los correos electrónicos no coinciden');
    if (formData.password !== formData.confirmPassword) return toast.error('Las contraseñas no coinciden');

    setLoading(true);
    try {
      const { confirmEmail, confirmPassword, ...dataToSend } = formData;
      await api.post('/users/register', dataToSend);
      toast.success('¡Cuenta creada exitosamente! Iniciá sesión.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'El DNI o Email ya se encuentran registrados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh px-4 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-blue-100/40 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Creá tu cuenta</h1>
            <p className="text-sm text-slate-500">Completá tus datos para empezar a operar hoy mismo.</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-blue-700 hover:underline">Volver al inicio</Link>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <input required name="dni" type="number" value={formData.dni} onChange={handleChange} placeholder="CUIL o DNI" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <input required name="confirmEmail" type="email" value={formData.confirmEmail} onChange={handleChange} placeholder="Confirmar email" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <input required name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Contraseña" className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-700">{showPassword ? '🙈' : '👁️'}</button>
            </div>
            <input required name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmar contraseña" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <button disabled={loading} className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Procesando...' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-5 border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
          ¿Ya tenés cuenta? <Link to="/login" className="font-bold text-blue-700 hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
