import { useState } from 'react';
import Card from '../ui/Card';

export default function EmptyState() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Card className="p-8 text-center">
      <div className="text-6xl mb-4">🏦</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        No hay cuentas vinculadas
      </h2>
      <p className="text-gray-600 mb-6">
        Para agregar dinero, primero necesitas vincular una cuenta bancaria
      </p>

      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <span className="flex items-center gap-2">
          <span>➕</span>
          Vincular cuenta bancaria
        </span>
      </button>
    </Card>
  );
}
