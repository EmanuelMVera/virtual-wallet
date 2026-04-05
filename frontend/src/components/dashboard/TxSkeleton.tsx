export default function TxSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl border bg-white shadow-sm animate-pulse" />
      ))}
    </div>
  );
}
