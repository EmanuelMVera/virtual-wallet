import { useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  listTransactions,
  transfer,
} from "../features/transaction/transactionSlice";
import {
  findAccount,
  clearLookup,
  getMyAccount,
} from "../features/account/accountSlice";

export default function TransferPage() {
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const dispatch = useAppDispatch();
  const { lookup, loading, error } = useAppSelector((s) => s.account);

  const onLookup = async () => {
    if (!query) return;
    await dispatch(findAccount(query));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!lookup) return;
    const r = await dispatch(transfer({ to: query, amount }));
    if (transfer.fulfilled.match(r)) {
      setAmount(0);
      setQuery("");
      dispatch(clearLookup());
      alert("Transferencia realizada");
      dispatch(getMyAccount());
      dispatch(listTransactions());
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Alias o CBU"
      />
      <button type="button" onClick={onLookup}>
        Buscar
      </button>
      {lookup && (
        <p>
          Destino: {lookup.alias} ({lookup.cbu})
        </p>
      )}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Monto"
      />
      <button type="submit" disabled={loading || !lookup}>
        Transferir
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
