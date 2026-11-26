// KasRumah — views-report.js
// The report page (this month against last month, per category), the
// 50/30/20 calculator, and settings (household name, reset). The CSV
// export downloads the month's real rows — nothing is invented for it.

import { CATEGORIES, LAST_MONTH, monthTotals, monthTransactions, categoryName } from './data.js';
import { rupiah, pct, escapeHtml } from './format.js';
import { barRow } from './charts.js';

const NEEDS = ['belanja', 'transport', 'tagihan', 'pendidikan', 'kesehatan'];
const WANTS = ['makan', 'hiburan', 'lainnya'];

export function reportView(state, query) {
  const t = monthTotals(state);
  const last = LAST_MONTH;
  const diff = t.expense - last.expense;
  const income = Number(query.get('penghasilan')) || t.income;
  const needActual = NEEDS.reduce((a, id) => a + (t.byCategory[id] || 0), 0);
  const wantActual = WANTS.reduce((a, id) => a + (t.byCategory[id] || 0), 0);
  const maxCat = Math.max(1, ...CATEGORIES.map((c) => Math.max(t.byCategory[c.id] || 0, last.byCategory[c.id] || 0)));

  return `<section class="page-head">
    <div><h1>Laporan Bulanan</h1>
    <p class="lede">November 2026 dibanding Oktober 2026. Pengeluaran ${diff <= 0 ? 'turun' : 'naik'} ${rupiah(Math.abs(diff))} dari bulan lalu.</p></div>
    <button class="btn primary" id="export-csv">Unduh CSV bulan ini</button>
  </section>

  <section class="grid-3">
    <div class="card stat"><span>Pemasukan</span><strong>${rupiah(t.income)}</strong><p class="muted">Okt: ${rupiah(last.income)} (${income >= last.income ? '+' : ''}${pct(t.income - last.income, last.income)}%)</p></div>
    <div class="card stat"><span>Pengeluaran</span><strong>${rupiah(t.expense)}</strong><p class="muted">Okt: ${rupiah(last.expense)} (${diff <= 0 ? '' : '+'}${pct(diff, last.expense)}%)</p></div>
    <div class="card stat"><span>Sisa &amp; tingkat tabungan</span><strong>${rupiah(t.left)}</strong><p class="muted">${pct(t.left, t.income)}% dari pemasukan disisihkan</p></div>
  </section>

  <section class="card">
    <h2>Per kategori: bulan ini vs bulan lalu</h2>
    ${CATEGORIES.map((c) => {
      const now = t.byCategory[c.id] || 0;
      const prev = last.byCategory[c.id] || 0;
      const change = prev ? pct(now - prev, prev) : 0;
      return barRow(`${c.name} — Okt ${rupiah(prev)}`, now, maxCat, c.color,
        `<div class="bar-sub"><span>${now <= prev ? 'Turun' : 'Naik'} ${Math.abs(change)}% dari bulan lalu</span><span>${rupiah(now)}</span></div>`);
    }).join('')}
  </section>

  <section class="card">
    <h2>Kalkulator 50/30/20</h2>
    <p>Aturan sederhana: 50% pemasukan untuk kebutuhan, 30% untuk keinginan, 20% untuk tabungan.
    Masukkan penghasilanmu dan bandingkan dengan kondisi keluarga ini bulan ini.</p>
    <form class="calc" id="calc-form" data-action="calc">
      <label>Penghasilan sebulan (Rp)
        <input type="number" name="penghasilan" min="0" step="100000" value="${income}" required>
      </label>
      <button class="btn primary" type="submit">Hitung</button>
    </form>
    <div class="grid-3">
      <div class="calc-box"><span>Kebutuhan (50%)</span><strong>${rupiah(income * 0.5)}</strong><p class="muted">Aktual: ${rupiah(needActual)} (${pct(needActual, income)}%)</p></div>
      <div class="calc-box"><span>Keinginan (30%)</span><strong>${rupiah(income * 0.3)}</strong><p class="muted">Aktual: ${rupiah(wantActual)} (${pct(wantActual, income)}%)</p></div>
      <div class="calc-box"><span>Tabungan (20%)</span><strong>${rupiah(income * 0.2)}</strong><p class="muted">Aktual disisihkan: ${rupiah(t.left)} (${pct(t.left, income)}%)</p></div>
    </div>
    <p>${t.left >= income * 0.2
      ? 'Keluarga ini sudah melewati target tabungan 20% — sisa bulan ini cukup untuk menambah Dana Darurat.'
      : 'Sisa bulan ini masih di bawah target tabungan 20%. Coba potong dari kategori Keinginan dulu.'}</p>
  </section>

  <section class="card">
    <h2>Apa yang berubah dari bulan lalu</h2>
    <ul class="notes">
      <li>Belanja harian turun dari ${rupiah(last.byCategory.belanja)} menjadi ${rupiah(t.byCategory.belanja)} karena keluarga mulai belanja ke pasar dua kali seminggu, bukan tiap hari.</li>
      <li>Pendidikan naik tipis karena les matematika anak dimulai bulan ini (${rupiah(350000)}).</li>
      <li>Transport turun karena Andi lebih sering naik motor sendiri daripada ojek online.</li>
    </ul>
  </section>`;
}

export function settingsView(state) {
  return `<section class="page-head">
    <div><h1>Pengaturan</h1>
    <p class="lede">Data tersimpan di browser ini saja. Tidak ada akun, tidak ada yang dikirim ke server.</p></div>
  </section>

  <form class="card form-grid" data-action="set-household">
    <h2>Nama keluarga</h2>
    <label>Nama yang tampil di situs
      <input type="text" name="household" value="${escapeHtml(state.household)}" required maxlength="60">
    </label>
    <div><button class="btn primary" type="submit">Simpan nama</button></div>
  </form>

  <div class="card">
    <h2>Data contoh</h2>
    <p>Semua angka di situs ini berasal dari catatan contoh Keluarga Hartono, November 2026.
    Ubah sesukamu — menambah transaksi, mengubah anggaran, menandai tagihan lunas — semuanya tersimpan di browser ini.</p>
    <button class="btn danger" id="reset-data">Kembalikan ke data contoh</button>
    <p class="muted small">Mengembalikan data contoh akan menghapus semua perubahanmu di browser ini.</p>
  </div>

  <div class="card">
    <h2>Tentang KasRumah</h2>
    <p>KasRumah adalah situs anggaran rumah tangga yang berjalan sepenuhnya dari file-nya sendiri:
    buka <code>index.html</code> di browser desktop atau ponsel, tanpa internet, tanpa akun.
    Dibuat untuk keluarga yang ingin tahu ke mana perginya uang setiap bulan — dan memastikan selalu ada sisa untuk ditabung.</p>
    <p><a href="#/">Kembali ke Beranda &rarr;</a></p>
  </div>`;
}

export function buildCsv(state) {
  const rows = monthTransactions(state).slice().sort((a, b) => a.date.localeCompare(b.date));
  const lines = ['tanggal,jenis,kategori,catatan,jumlah_rp'];
  for (const r of rows) {
    const note = `"${r.note.replaceAll('"', '""')}"`;
    lines.push(`${r.date},${r.kind},${categoryName(r.category)},${note},${r.amount}`);
  }
  return lines.join('\n');
}
