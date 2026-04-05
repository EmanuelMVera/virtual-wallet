import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, updateProfile } from '../features/userSlice'; 
import { formatMoney } from '../utils/format';
import { toast } from 'sonner';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.user);

  const [edit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
    }
  }, [user]);

  async function handleSave() {
    const result = await dispatch(updateProfile({ firstName, lastName }));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Perfil actualizado');
      setEdit(false);
    } else {
      toast.error('Error al actualizar');
    }
  }

  if (!user) return <div className="p-4">No hay sesión activa.</div>;

  return (
    <div className="mx-auto max-w-screen-sm p-4 space-y-5">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-blue-600 py-5 text-center text-white shadow">
        <div className="text-sm opacity-90">Saldo disponible</div>
        <div className="mt-1 text-3xl font-semibold">{formatMoney(user.balance ?? 0)}</div>
      </div>

      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
        <div className="flex flex-col items-center">
          <div className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-blue-600 text-white text-xl font-semibold">
            {user.firstName?.[0]?.toUpperCase()}
          </div>
          {edit ? (
            <div className="w-full space-y-2 mb-2">
              <input value={firstName} onChange={e => setFirstName(e.target.value)} className="border p-2 rounded w-full" placeholder="Nombre" />
              <input value={lastName} onChange={e => setLastName(e.target.value)} className="border p-2 rounded w-full" placeholder="Apellido" />
            </div>
          ) : (
            <div className="text-lg font-medium">{user.firstName} {user.lastName}</div>
          )}
          <div className="text-sm text-gray-500 mb-2">{user.alias}</div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {edit ? (
            <button onClick={handleSave} className="bg-blue-600 text-white p-3 rounded-xl font-semibold">Guardar</button>
          ) : (
            <button onClick={() => setEdit(true)} className="bg-blue-600 text-white p-3 rounded-xl font-semibold">Editar Perfil</button>
          )}
          <button onClick={() => dispatch(logout())} className="bg-gray-100 text-gray-900 p-3 rounded-xl font-semibold hover:bg-gray-200">Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}