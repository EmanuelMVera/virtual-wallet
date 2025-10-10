export type RecentRecipient = { alias?: string; cbu?: string; label: string };

const KEY = "vw:recentRecipients";

export function useRecentRecipients() {
  const getAll = (): RecentRecipient[] => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch { return []; }
  };
  const add = (r: RecentRecipient) => {
    const list = getAll();
    const exists = list.find(x => (r.alias && x.alias===r.alias) || (r.cbu && x.cbu===r.cbu));
    const next = [r, ...list.filter(x => x!==exists)].slice(0, 6);
    localStorage.setItem(KEY, JSON.stringify(next));
  };
  const clear = () => localStorage.removeItem(KEY);
  return { getAll, add, clear };
}
