import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, updateProfile, updatePassword } from '../features/userSlice';
import { formatMoney } from '../utils/format';
import { toast } from 'sonner';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.user);

  const [edit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
    }
  }, [user]);

  async function handleSaveProfile() {
    const result = await dispatch(updateProfile({ firstName, lastName }));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Perfil actualizado');
      setEdit(false);
    } else {
      toast.error('Error al actualizar perfil');
    }
  }

  async function handlePasswordChange() {
    if (!password.trim()) {
      toast.error('Ingresá una contraseña');
      return;
    }

    const result = await dispatch(updatePassword(password));
    if (updatePassword.fulfilled.match(result)) {
      toast.success('Contraseña actualizada');
      setPassword('');
    } else {
      toast.error((result.payload as string) ?? 'Error al actualizar contraseña');
    }
  }

  if (!user) return <div className="p-4">No hay sesión activa.</div>;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-xl">
        <p className="text-sm text-slate-300">Saldo disponible</p>
        <p className="mt-1 text-4xl font-black">{formatMoney(user.balance ?? 0)}</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">{user.firstName?.[0]?.toUpperCase()}</div>
          <div>
            <p className="text-lg font-bold text-slate-900">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-slate-500">Alias: {user.alias}</p>
          </div>
        </div>

        <div className="space-y-3">
          {edit ? (
            <>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Nombre" />
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Apellido" />
              <button onClick={handleSaveProfile} className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white">Guardar cambios</button>
            </>
          ) : (
            <button onClick={() => setEdit(true)} className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white">Editar perfil</button>
          )}

          <div className="border-t border-slate-200 pt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Nueva contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="********" />
            <button onClick={handlePasswordChange} className="mt-2 w-full rounded-xl bg-slate-900 p-3 font-semibold text-white">Actualizar contraseña</button>
          </div>

          <button onClick={() => dispatch(logout())} className="w-full rounded-xl bg-slate-100 p-3 font-semibold text-slate-900 hover:bg-slate-200">Cerrar sesión</button>
        </div>
      </section>
    </div>
  );
}
