import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    dni: "", firstName: "", lastName: "", phone: "", 
    email: "", confirmEmail: "", 
    password: "", confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones de coincidencia
    if (formData.email !== formData.confirmEmail) {
      return toast.error("Los correos electrónicos no coinciden");
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }

    setLoading(true);
    try {
      // Enviamos solo lo que el backend espera (excluimos las confirmaciones)
      const { confirmEmail, confirmPassword, ...dataToSend } = formData;
      await api.post("/users/register", dataToSend);
      toast.success("¡Cuenta creada exitosamente! Iniciá sesión.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "El DNI o Email ya se encuentran registrados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#f7f8fa] via-white to-white text-gray-800">
      {/* Header simple para volver atrás */}
      <header className="border-b border-gray-200 bg-[#fff200] px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white">M</div>
            <span className="font-black text-gray-900">mercado pago</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-blue-700 hover:underline">Volver al inicio</Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <section className="rounded-3xl bg-white p-8 shadow-lg border border-gray-100">
          <h1 className="text-2xl font-black text-sky-900 mb-6">Completá tus datos para registrarte</h1>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CUIL o DNI</label>
                <input required name="dni" type="number" value={formData.dni} onChange={handleChange} placeholder="Sin puntos ni guiones" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Ej: 1123456789" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Email</label>
                <input required name="confirmEmail" type="email" value={formData.confirmEmail} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input required name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-gray-500 hover:text-gray-700">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                <input required name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
              </div>
            </div>

            <button disabled={loading} className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60">
              {loading ? "Procesando..." : "Registrarme"}
            </button>
          </form>
          
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-sm text-gray-600">¿Ya tenés cuenta? <Link to="/login" className="font-bold text-blue-700 hover:underline">Iniciar sesión</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
}