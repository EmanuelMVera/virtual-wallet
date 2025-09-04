import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getMyAccount } from "../features/account/accountSlice";
import { listTransactions } from "../features/transaction/transactionSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const acc = useAppSelector((s) => s.account.me);
  const tx = useAppSelector((s) => s.transaction.items);

  useEffect(() => {
    dispatch(getMyAccount());
    dispatch(listTransactions());
  }, [dispatch]);

  return (
    <div>
      <h2>Saldo: {acc ? acc.balance : "—"}</h2>
      <p>
        Alias: {acc?.alias} — CBU: {acc?.cbu}
      </p>

      <h3>Últimas transacciones</h3>
      <ul>
        {tx.map((t) => (
          <li key={t.id}>
            [{t.type}] {t.amount}{" "}
            {t.senderAccountId === null
              ? "(depósito)"
              : acc && t.senderAccountId === acc.id
              ? "→ salida"
              : "← entrada"}
          </li>
        ))}
      </ul>
    </div>
  );
}
