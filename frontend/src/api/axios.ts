import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api",
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res, 
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data?.message || "Error de conexión";

    if (status === 401) {
      localStorage.removeItem("token");
      toast.error("Sesión expirada");
      setTimeout(() => window.location.href = "/login", 1000);
    } else if (status === 500) {
      toast.error("Error en el servidor");
    } else {
      toast.error(msg);
    }

    return Promise.reject(err);
  }
);

export default api;