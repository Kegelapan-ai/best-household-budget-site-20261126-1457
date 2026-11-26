// KasRumah — data.js
// The household's own records: seed figures for Keluarga Hartono, November
// 2026, plus the store that keeps every change in the browser's localStorage.
// Nothing here is fetched: it all ships in this file, and every total the
// site shows is computed from these rows, never typed in twice.

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', color: '#2e7d4f', budget: 3500000 },
  { id: 'makan', name: 'Makan & Jajan', color: '#c47b1e', budget: 1800000 },
  { id: 'transport', name: 'Transport', color: '#2b6cb0', budget: 1200000 },
  { id: 'tagihan', name: 'Tagihan Rumah', color: '#6b4fa1', budget: 2400000 },
  { id: 'pendidikan', name: 'Pendidikan', color: '#0f766e', budget: 1500000 },
  { id: 'kesehatan', name: 'Kesehatan', color: '#b3375a', budget: 800000 },
  { id: 'hiburan', name: 'Hiburan', color: '#8a6d1b', budget: 600000 },
  { id: 'lainnya', name: 'Lainnya', color: '#5b6470', budget: 500000 },
];

export const MONTHS = [
  { id: '2026-11', label: 'November 2026' },
  { id: '2026-10', label: 'Oktober 2026' },
];

// Every transaction below is a real row of this household's November book.
// Income: gaji Andi Hartono Rp 12.500.000 (5 Nov) + usaha kue Sari
// Rp 2.300.000 (12 Nov) = Rp 14.800.000. Expenses add to Rp 8.338.200.
export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-02', kind: 'expense', category: 'belanja', note: 'Pasar Tradisional — sayur & buah', amount: 312000 },
  { id: 't02', date: '2026-11-03', kind: 'expense', category: 'makan', note: 'Warteg — makan siang keluarga', amount: 87000 },
  { id: 't03', date: '2026-11-04', kind: 'expense', category: 'transport', note: 'Bensin motor', amount: 52000 },
  { id: 't04', date: '2026-11-05', kind: 'income', category: 'lainnya', note: 'Gaji Andi Hartono', amount: 12500000 },
  { id: 't05', date: '2026-11-05', kind: 'expense', category: 'belanja', note: 'Supermarket — beras 25 kg + minyak', amount: 486500 },
  { id: 't06', date: '2026-11-06', kind: 'expense', category: 'transport', note: 'Tol & parkir', amount: 85000 },
  { id: 't07', date: '2026-11-07', kind: 'expense', category: 'makan', note: 'Restoran — makan malam akhir pekan', amount: 342000 },
  { id: 't08', date: '2026-11-07', kind: 'expense', category: 'hiburan', note: 'Langganan streaming', amount: 54000 },
  { id: 't09', date: '2026-11-08', kind: 'expense', category: 'pendidikan', note: 'SPP sekolah anak', amount: 750000 },
  { id: 't10', date: '2026-11-09', kind: 'expense', category: 'belanja', note: 'Pasar Tradisional — ayam & ikan', amount: 278000 },
  { id: 't11', date: '2026-11-09', kind: 'expense', category: 'kesehatan', note: 'Apotek — vitamin', amount: 124000 },
  { id: 't12', date: '2026-11-10', kind: 'expense', category: 'transport', note: 'Bensin motor', amount: 54000 },
  { id: 't13', date: '2026-11-10', kind: 'expense', category: 'tagihan', note: 'Internet rumah', amount: 349000 },
  { id: 't14', date: '2026-11-11', kind: 'expense', category: 'makan', note: 'Kopi & jajan anak', amount: 64500 },
  { id: 't15', date: '2026-11-12', kind: 'income', category: 'lainnya', note: 'Usaha kue Sari — penjualan minggu ke-2', amount: 2300000 },
  { id: 't16', date: '2026-11-12', kind: 'expense', category: 'belanja', note: 'Supermarket — kebutuhan mingguan', amount: 524000 },
  { id: 't17', date: '2026-11-12', kind: 'expense', category: 'lainnya', note: 'Potong rambut', amount: 75000 },
  { id: 't18', date: '2026-11-13', kind: 'expense', category: 'transport', note: 'Ojek online', amount: 78000 },
  { id: 't19', date: '2026-11-14', kind: 'expense', category: 'makan', note: 'Pesan antar — makan malam', amount: 128000 },
  { id: 't20', date: '2026-11-14', kind: 'expense', category: 'hiburan', note: 'Bioskop keluarga', amount: 216000 },
  { id: 't21', date: '2026-11-15', kind: 'expense', category: 'tagihan', note: 'Air PDAM', amount: 214500 },
  { id: 't22', date: '2026-11-15', kind: 'expense', category: 'pendidikan', note: 'Buku & alat tulis', amount: 186000 },
  { id: 't23', date: '2026-11-16', kind: 'expense', category: 'belanja', note: 'Pasar Tradisional — sayur & telur', amount: 196500 },
  { id: 't24', date: '2026-11-17', kind: 'expense', category: 'transport', note: 'Bensin motor', amount: 51000 },
  { id: 't25', date: '2026-11-18', kind: 'expense', category: 'makan', note: 'Warteg — makan siang', amount: 76000 },
  { id: 't26', date: '2026-11-19', kind: 'expense', category: 'belanja', note: 'Supermarket — beras + telur + susu', amount: 612000 },
  { id: 't27', date: '2026-11-19', kind: 'expense', category: 'kesehatan', note: 'Dokter gigi anak', amount: 285000 },
  { id: 't28', date: '2026-11-20', kind: 'expense', category: 'transport', note: 'Tol & parkir', amount: 92000 },
  { id: 't29', date: '2026-11-20', kind: 'expense', category: 'tagihan', note: 'Listrik PLN', amount: 486200 },
  { id: 't30', date: '2026-11-21', kind: 'expense', category: 'makan', note: 'Restoran — ulang tahun Ibu', amount: 486000 },
  { id: 't31', date: '2026-11-21', kind: 'expense', category: 'hiburan', note: 'Mainan anak', amount: 178000 },
  { id: 't32', date: '2026-11-22', kind: 'expense', category: 'pendidikan', note: 'Les matematika anak', amount: 350000 },
  { id: 't33', date: '2026-11-23', kind: 'expense', category: 'belanja', note: 'Pasar Tradisional — buah & bumbu', amount: 148000 },
  { id: 't34', date: '2026-11-23', kind: 'expense', category: 'lainnya', note: 'Servis kipas angin', amount: 165000 },
  { id: 't35', date: '2026-11-24', kind: 'expense', category: 'transport', note: 'Bensin motor', amount: 53000 },
  { id: 't36', date: '2026-11-24', kind: 'expense', category: 'makan', note: 'Jajan sekolah anak', amount: 92000 },
  { id: 't37', date: '2026-11-25', kind: 'expense', category: 'tagihan', note: 'BPJS Kesehatan', amount: 210000 },
  { id: 't38', date: '2026-11-26', kind: 'expense', category: 'belanja', note: 'Supermarket — kebutuhan mingguan', amount: 398000 },
];

// Scheduled bills. The four marked paid match the transactions above
// (Internet 10 Nov, Air 15 Nov, Listrik 20 Nov, BPJS 25 Nov); the rest are
// still due before the month ends.
export const SEED_BILLS = [
  { id: 'b1', name: 'Internet rumah', amount: 349000, due: '2026-11-10', paid: true, note: 'Tagihan bulanan, lunas 10 Nov' },
  { id: 'b2', name: 'Air PDAM', amount: 214500, due: '2026-11-15', paid: true, note: 'Tagihan bulanan, lunas 15 Nov' },
  { id: 'b3', name: 'Listrik PLN', amount: 486200, due: '2026-11-20', paid: true, note: 'Tagihan bulanan, lunas 20 Nov' },
  { id: 'b4', name: 'BPJS Kesehatan', amount: 210000, due: '2026-11-25', paid: true, note: 'Iuran bulanan, lunas 25 Nov' },
  { id: 'b5', name: 'Iuran RT', amount: 50000, due: '2026-11-30', paid: false, note: 'Iuran keamanan & kebersihan' },
  { id: 'b6', name: 'Cicilan motor', amount: 1125000, due: '2026-11-28', paid: false, note: 'Angsuran ke-14 dari 35' },
  { id: 'b7', name: 'Air galon & gas', amount: 96000, due: '2026-11-27', paid: false, note: 'Pesan ke warung langganan' },
];

// Savings goals, with what the family has already set aside.
export const SEED_GOALS = [
  { id: 'g1', name: 'Dana Darurat', target: 20000000, saved: 12750000, note: 'Target 6x pengeluaran pokok sebulan' },
  { id: 'g2', name: 'Liburan Keluarga', target: 8000000, saved: 3200000, note: 'Liburan ke Yogyakarta, Juni 2027' },
  { id: 'g3', name: 'DP Motor Baru', target: 6000000, saved: 1500000, note: 'Ganti motor lama tahun depan' },
];

// Last month's book, kept for the report page's comparison.
export const LAST_MONTH = {
  id: '2026-10',
  income: 14200000,
  expense: 9412000,
  byCategory: {
    belanja: 4011000, makan: 1398000, transport: 512000, tagihan: 1189000,
    pendidikan: 1290000, kesehatan: 296000, hiburan: 402000, lainnya: 314000,
  },
};

const KEY = 'kasrumah-v1';

function seed() {
  return {
    household: 'Keluarga Hartono',
    month: '2026-11',
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    bills: SEED_BILLS.map((b) => ({ ...b })),
    goals: SEED_GOALS.map((g) => ({ ...g })),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
  return seed();
}

export function monthTransactions(state) {
  return state.transactions.filter((t) => t.date.startsWith(state.month));
}

export function monthTotals(state) {
  const rows = monthTransactions(state);
  let income = 0;
  let expense = 0;
  const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of rows) {
    if (t.kind === 'income') income += t.amount;
    else {
      expense += t.amount;
      if (byCategory[t.category] !== undefined) byCategory[t.category] += t.amount;
    }
  }
  return { income, expense, left: income - expense, byCategory };
}

export function categoryName(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.name : 'Lainnya';
}

export function categoryColor(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.color : '#5b6470';
}

export function newId(prefix, state) {
  return `${prefix}${Date.now().toString(36)}${state.transactions.length}`;
}
