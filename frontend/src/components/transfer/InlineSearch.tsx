import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { findAccount, clearLookup } from "../../features/account/accountSlice";

export default function InlineSearch({
  value,
  onPick,
}: {
  value: string;
  onPick: (aliasOrCbu: string) => void;
}) {
  const dispatch = useAppDispatch();
  const lookup = useAppSelector((s) => s.account.lookup);
  const [open, setOpen] = useState(false);
  const tRef = useRef<number | null>(null); 

  useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    if (!value || value.trim().length < 3) {
      setOpen(false);
      return;
    }
    tRef.current = window.setTimeout(() => {
      dispatch(findAccount(value)).then(() => setOpen(true));
    }, 300);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [value, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearLookup());
    };
  }, [dispatch]);

  if (!open) return null;

  return (
    <div className="mt-1 rounded-xl border bg-white shadow-lg">
      {lookup ? (
        <button
          type="button"
          onClick={() => {
            onPick(lookup.alias ?? lookup.cbu);
            setOpen(false);
          }}
          className="w-full p-3 text-left hover:bg-gray-50"
        >
          <div className="text-sm font-medium">{lookup.alias ?? lookup.cbu}</div>
          {lookup.alias && lookup.cbu && (
            <div className="text-xs text-gray-500">{lookup.cbu}</div>
          )}
        </button>
      ) : (
        <div className="p-3 text-sm text-gray-500">Sin resultados</div>
      )}
    </div>
  );
}
