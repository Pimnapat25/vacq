export function formatIsoDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return String(iso);
  }
}

export function formatIsoDateOnly(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch {
    return String(iso);
  }
}

export function isFuture(iso) {
  if (!iso) return false;
  return new Date(iso).getTime() > Date.now();
}
