export const formatMoney = (n?: number | string, currency = "ARS") => {
  const num = typeof n === "string" ? Number(n) : n ?? 0;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
};

export const formatRelative = (iso?: string | number | Date) => {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "justo ahora";
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "ayer";
  return d.toLocaleDateString("es-AR");
};
