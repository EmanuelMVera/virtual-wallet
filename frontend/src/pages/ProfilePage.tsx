import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { formatMoney } from "../utils/format";
import { toast } from "sonner";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";

export default function ProfilePage() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);
  const account = useAppSelector((s) => s.account.me);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  return (
    <div className="mx-auto max-w-screen-sm p-4 space-y-5">
      <h1 className="text-xl font-semibold">Perfil de usuario</h1>

      {/* Información del usuario */}
      <Card className="p-4 space-y-2">
        <SectionTitle>Datos personales</SectionTitle>
        <p className="text-sm text-gray-700">
          <b>Nombre:</b> {user?.name ?? "No disponible"}
        </p>
        <p className="text-sm text-gray-700">
          <b>Email:</b> {user?.email ?? "No disponible"}
        </p>
      </Card>

      {/* Cuenta virtual */}
      <Card className="p-4 space-y-3">
        <SectionTitle>Cuenta virtual</SectionTitle>

        {account ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Alias</span>
              <button
                onClick={() => copy(account.alias ?? "", "Alias")}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {account.alias ?? "No asignado"}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">CBU</span>
              <button
                onClick={() => copy(account.cbu ?? "", "CBU")}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {account.cbu ?? "No asignado"}
              </button>
            </div>

            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600">Saldo disponible</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {formatMoney(account.balance)}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            No se pudo cargar la información de la cuenta.
          </p>
        )}
      </Card>

      {/* Botón de cierre de sesión */}
      <button
        onClick={() => dispatch(logout())}
        className="w-full rounded-xl bg-gray-900 text-white py-3 font-semibold hover:bg-black"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
