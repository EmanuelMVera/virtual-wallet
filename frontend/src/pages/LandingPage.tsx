import { Link } from "react-router-dom";

const MENU = ["Productos", "Tarjetas", "Pagos", "Créditos", "Seguridad", "Ayuda"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f8fa] via-white to-white text-gray-700">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-[#fff200] shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">M</div>
            <span className="text-xl font-black tracking-tight">mercado pago</span>
          </div>
          <nav className="hidden gap-4 text-sm font-medium text-gray-800 sm:flex">
            {MENU.map((item) => (
              <a key={item} href="#" className="rounded-lg px-3 py-2 transition hover:bg-white/80">{item}</a>
            ))}
          </nav>
          <div className="flex gap-2">
            <Link to="/login" className="rounded-lg border border-gray-900/10 bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-100">Iniciar sesión</Link>
            <Link to="/register" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800">Abrir cuenta gratis</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Tu dinero crece todos los días</p>
            <h1 className="text-4xl font-black text-gray-950 sm:text-5xl">Paga, cobrá y mové tu dinero desde un mismo lugar</h1>
            <p className="max-w-xl text-lg text-gray-700">Con la experiencia más completa. Tené control total de tu cashflow, en la app y en el sitio.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login" className="rounded-lg bg-blue-700 px-6 py-3 text-base font-bold text-white hover:bg-blue-800">Iniciar sesión</Link>
              <Link to="/register" className="rounded-lg border border-blue-700 px-6 py-3 text-base font-bold text-blue-700 hover:bg-blue-100">Abrir cuenta gratis</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-blue-50 shadow-lg h-80 flex items-center justify-center">
            <span className="text-blue-300 text-6xl">💳</span>
            <div className="absolute bottom-4 left-4 rounded-lg bg-blue-900/70 px-4 py-2 text-sm font-semibold text-white">Promo: 100% online</div>
          </div>
        </section>
      </main>
    </div>
  );
}