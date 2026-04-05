import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

export default function RegisterPage() {
  const [step, setStep] = useState<"check" | "form">("check");
  const [formData, setFormData] = useState({
    dni: "", firstName: "", lastName: "", email: "", phone: "", password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === "check") {
      if (!formData.dni.trim()) return toast.error("Ingresá CUIL o DNI");
      setStep("form");
      return;
    }

    try {
      await api.post("/users/register", formData);
      toast.success("Cuenta creada. Inicia sesión.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "No se pudo registrar");
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#fff9be] via-white to-white px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-lg">
          <h1 className="text-2xl font-black text-sky-900">Crear cuenta</h1>
          
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {step === "check" ? (
              <>
                <label className="block text-sm text-gray-600">CUIL o DNI</label>
                <input name="dni" value={formData.dni} onChange={handleChange} placeholder="12345678" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none" />
                <button className="w-full rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">Continuar</button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Nombre</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Apellido</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none" />
                  </div>
                </div>
                <label className="block text-sm text-gray-600">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none" />
                <label className="block text-sm text-gray-600">Teléfono</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none" />
                <label className="block text-sm text-gray-600">Contraseña</label>
                <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Mínimo 6 caracteres" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none" />

                <button className="w-full rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">Registrarme</button>
                <button type="button" onClick={() => setStep("check")} className="text-sm font-semibold text-blue-700">Volver</button>
              </>
            )}
          </form>
          <p className="mt-4 text-sm text-gray-500">¿Ya tenés cuenta? <Link to="/login" className="font-semibold text-blue-700">Iniciar sesión</Link></p>
        </section>
      </div>
    </div>
  );
}