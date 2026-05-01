export function formatForBackend(v) {
  // Accept numeric timestamps, ISO strings, Date objects
  let d;
  if (v == null) return null;
  if (typeof v === 'number' || /^\d+$/.test(String(v))) {
    d = new Date(Number(v));
  } else if (v instanceof Date) {
    d = v;
  } else {
    d = new Date(String(v));
  }

  if (isNaN(d.getTime())) return null;

  const pad = (n) => String(n).padStart(2, '0');
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  // Use ISO-like format with 'T' separator to avoid spaces in URL path segments
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}`;
}
