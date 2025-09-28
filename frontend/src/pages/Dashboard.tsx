import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getMyAccount } from "../features/account/accountSlice";
import { listTransactions } from "../features/transaction/transactionSlice";
import { formatMoney } from "../utils/format";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import SectionTitle from "../components/ui/SectionTitle";
import TxItem from "../components/transactions/TxItem";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const acc = useAppSelector((s) => s.account.me);
  const accLoading = useAppSelector((s) => s.account.loading);
  const accErr = useAppSelector((s) => s.account.error);
  const tx = useAppSelector((s) => s.transaction.items);
  const txLoading = useAppSelector((s) => s.transaction.loading);

  useEffect(() => {
    dispatch(getMyAccount());
    dispatch(listTransactions());
  }, [dispatch]);

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Hero saldo */}
      <div className="bg-[#009EE3] text-white">
        <div className="mx-auto w-full max-w-screen-sm px-4 py-6">
          <p className="text-sm/5 opacity-90">Saldo disponible</p>
          {accLoading ? (
            <Skeleton className="h-9 w-40 mt-1" />
          ) : (
            <p className="mt-1 text-3xl font-semibold">
              {acc ? formatMoney(acc.balance) : "--"}
            </p>
          )}
          <p className="mt-2 text-xs/5 opacity-90">
            {acc ? (
              <>
                Alias: <span className="font-medium">{acc.alias}</span>{" "}
                · CBU: <span className="font-medium">{acc.cbu}</span>
              </>
            ) : accErr ? (
              <span className="text-red-100">No se pudo cargar la cuenta</span>
            ) : (
              <span className="opacity-70">Cargando…</span>
            )}
          </p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mx-auto w-full max-w-screen-sm px-4 -mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 text-center" >
            <Link to="/transfer" className="block">
              <div className="text-sm font-medium text-gray-900">Transferir</div>
              <div className="text-xs text-gray-500">Enviar dinero</div>
            </Link>
          </Card>
          <Card className="p-4 text-center">
            <Link to="/pay" className="block">
              <div className="text-sm font-medium text-gray-900">Pagar</div>
              <div className="text-xs text-gray-500">Próximamente</div>
            </Link>
          </Card>
          <Card className="p-4 text-center">
            <Link to="/add-money" className="block">
              <div className="text-sm font-medium text-gray-900">Recargar</div>
              <div className="text-xs text-gray-500">Agregar dinero</div>
            </Link>
          </Card>
          <Card className="p-4 text-center">
            <Link to="/activity" className="block">
              <div className="text-sm font-medium text-gray-900">Movimientos</div>
              <div className="text-xs text-gray-500">Ver todo</div>
            </Link>
          </Card>
        </div>
      </div>

      {/* Últimas transacciones */}
      <div className="mx-auto w-full max-w-screen-sm px-4 py-6">
        <SectionTitle>Últimas transacciones</SectionTitle>
        <Card className="mt-3 p-3">
          {txLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
            </div>
          ) : tx.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Aún no hay movimientos
            </div>
          ) : (
            <ul>
              {tx.slice(0, 6).map((t) => (
                <TxItem key={t.id} tx={t} myAccountId={acc?.id} />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
