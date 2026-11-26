// KasRumah — format.js
// Rupiah, dates and small text helpers. One job: make every figure on the
// site read the same way, in Indonesian, with no surprises.

const IDR = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function rupiah(n) {
  return IDR.format(Math.round(n));
}

export function rupiahShort(n) {
  if (Math.abs(n) >= 1000000) return `Rp ${(n / 1000000).toFixed(1).replace('.', ',')} jt`;
  if (Math.abs(n) >= 1000) return `Rp ${Math.round(n / 1000)} rb`;
  return rupiah(n);
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function dateLong(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

export function dateShort(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTH_NAMES[m - 1].slice(0, 3)}`;
}

export function monthLabel(id) {
  const [y, m] = id.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
