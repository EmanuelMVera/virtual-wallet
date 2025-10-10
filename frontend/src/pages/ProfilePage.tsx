import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user); // si guardás algo del usuario; opcional

  return (
    <div className="mx-auto max-w-screen-sm p-4 space-y-4">
      <h1 className="text-xl font-semibold">Perfil</h1>

      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm text-gray-700">
          {user ? <>Sesión iniciada como <b>{user.email}</b></> : "Sesión activa"}
        </div>
      </div>

      <button
        onClick={() => dispatch(logout())}
        className="w-full rounded-xl bg-gray-900 text-white py-2 font-medium hover:bg-black"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
