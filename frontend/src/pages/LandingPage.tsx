import { Link } from 'react-router-dom';

const MENU = ['Productos', 'Tarjetas', 'Pagos', 'Créditos', 'Seguridad', 'Ayuda'];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-800">
      <header className="soft-glass sticky top-0 z-20 border-b border-slate-200/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 font-bold text-white">VW</div>
            <span className="text-xl font-black tracking-tight">virtual wallet</span>
          </div>
          <nav className="hidden gap-2 text-sm font-medium text-slate-700 lg:flex">
            {MENU.map((item) => (
              <a key={item} href="#" className="rounded-xl px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex gap-2">
            <Link to="/login" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              Iniciar sesión
            </Link>
            <Link to="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-7 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Billetera digital moderna</span>
            <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">Una experiencia financiera clara, rápida y realmente agradable.</h1>
            <p className="max-w-xl text-lg text-slate-600">Gestioná ingresos, retiros, transferencias y tu actividad con paneles visuales, navegación intuitiva y diseño mobile-first.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800">Abrir cuenta gratis</Link>
              <Link to="/login" className="rounded-xl border border-blue-300 bg-blue-50 px-6 py-3 font-bold text-blue-700 hover:bg-blue-100">Ya tengo cuenta</Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-2xl shadow-slate-300/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Saldo en tiempo real</p>
              <p className="mt-2 text-4xl font-black">$ 1.240.560</p>
              <p className="mt-3 text-sm text-slate-300">Rendimiento diario +2.4%</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">Ingresos</p>
                <p className="mt-2 text-2xl font-bold text-emerald-700">+ $125.000</p>
              </div>
              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-600">Transferencias</p>
                <p className="mt-2 text-2xl font-bold text-violet-700">42 este mes</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
