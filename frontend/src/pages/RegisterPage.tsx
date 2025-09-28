import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/users/register", { name, email, password });
      toast.success("Cuenta creada. Inicia sesión.");
      navigate("/");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "No se pudo registrar";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Crear cuenta</h1>

        <label className="mb-2 block text-sm text-gray-600">Nombre</label>
        <input className="mb-3 w-full rounded-lg border px-3 py-2 focus:outline-none focus:border-blue-500"
               value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />

        <label className="mb-2 block text-sm text-gray-600">Email</label>
        <input className="mb-3 w-full rounded-lg border px-3 py-2 focus:outline-none focus:border-blue-500"
               value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@dominio.com" />

        <label className="mb-2 block text-sm text-gray-600">Contraseña</label>
        <input type="password" className="mb-4 w-full rounded-lg border px-3 py-2 focus:outline-none focus:border-blue-500"
               value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white">Registrarme</button>
        <p className="mt-3 text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link to="/" className="text-blue-600">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
