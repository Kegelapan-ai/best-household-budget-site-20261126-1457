// KasRumah — views-dashboard.js
// The home page: the month at a glance, where the money went, what is due
// soon, and the newest transactions. Every figure comes from monthTotals.

import { CATEGORIES, monthTotals, monthTransactions, categoryName, categoryColor } from './data.js';
import { rupiah, rupiahShort, pct, dateShort, escapeHtml } from './format.js';
import { donut, categoryBars } from './charts.js';

export function dashboardView(state) {
  const t = monthTotals(state);
  const rows = monthTransactions(state).slice().sort((a, b) => b.date.localeCompare(a.date));
  const dueSoon = state.bills
    .filter((b) => !b.paid)
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 3);
  const over = CATEGORIES.filter((c) => (t.byCategory[c.id] || 0) > state.budgets[c.id]);
  const segments = CATEGORIES.map((c) => ({
    label: c.name, value: t.byCategory[c.id] || 0, color: c.color,
  })).filter((s) => s.value > 0);

  return `<section class="hero">
    <div>
      <p class="eyebrow">Anggaran ${escapeHtml(state.household)}</p>
      <h1>Uang bulan ini masih aman.</h1>
      <p class="lede">Dari pemasukan ${rupiah(t.income)}, sudah terpakai ${rupiah(t.expense)}.
      Sisa ${rupiah(t.left)} — ${pct(t.left, t.income)}% dari pemasukan — bisa masuk tabungan.</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/transaksi">+ Catat Pengeluaran</a>
        <a class="btn" href="#/anggaran">Lihat Anggaran</a>
      </div>
    </div>
    <div class="hero-card">
      <p class="card-label">Sisa bulan ini</p>
      <p class="big-number">${rupiah(t.left)}</p>
      <p class="muted">Pemasukan ${rupiah(t.income)} &middot; Pengeluaran ${rupiah(t.expense)}</p>
      <div class="meter"><div style="width:${pct(t.expense, t.income)}%"></div></div>
      <p class="muted small">Terpakai ${pct(t.expense, t.income)}% dari pemasukan</p>
      ${over.length ? `<p class="alert">Lewat anggaran: ${over.map((c) => escapeHtml(c.name)).join(', ')}.</p>` : '<p class="ok">Semua kategori masih dalam anggaran.</p>'}
    </div>
  </section>

  <section class="grid-2">
    <div class="card">
      <h2>Ke mana uang pergi</h2>
      ${donut(segments, 'Pengeluaran', rupiahShort(t.expense))}
    </div>
    <div class="card">
      <h2>Anggaran per kategori</h2>
      ${categoryBars(t.byCategory, CATEGORIES, state.budgets)}
      <p><a href="#/anggaran">Atur semua anggaran &rarr;</a></p>
    </div>
  </section>

  <section class="grid-2">
    <div class="card">
      <h2>Tagihan yang segera jatuh tempo</h2>
      ${dueSoon.length ? `<ul class="bill-list">${dueSoon.map((b) => `<li>
        <div><strong>${escapeHtml(b.name)}</strong><span class="muted">Jatuh tempo ${dateShort(b.due)}</span></div>
        <strong>${rupiah(b.amount)}</strong></li>`).join('')}</ul>
        <p><a href="#/tagihan">Semua tagihan &rarr;</a></p>`
        : '<p class="ok">Semua tagihan bulan ini sudah lunas.</p>'}
    </div>
    <div class="card">
      <h2>Transaksi terbaru</h2>
      <ul class="tx-list">${rows.slice(0, 6).map((r) => `<li>
        <span class="tx-dot" style="background:${r.kind === 'income' ? '#2e7d4f' : categoryColor(r.category)}"></span>
        <div><strong>${escapeHtml(r.note)}</strong><span class="muted">${dateShort(r.date)} &middot; ${categoryName(r.category)}</span></div>
        <strong class="${r.kind === 'income' ? 'in' : 'out'}">${r.kind === 'income' ? '+' : '&minus;'}${rupiah(r.amount)}</strong></li>`).join('')}</ul>
      <p><a href="#/transaksi">Semua transaksi &rarr;</a></p>
    </div>
  </section>

  <section class="card tips">
    <h2>Tiga hal yang bisa dilakukan minggu ini</h2>
    <ol>
      <li><strong>Sisihkan ${rupiah(2960000)} untuk tabungan</strong> — sesuai aturan 50/30/20 dari pemasukan bulan ini.</li>
      <li><strong>Bayar cicilan motor Rp 1.125.000</strong> sebelum 28 November supaya tidak kena denda.</li>
      <li><strong>Belanja harian masih sisa ${rupiahShort(state.budgets.belanja - t.byCategory.belanja)}</strong> sampai akhir bulan — cukup untuk dua kali belanja mingguan lagi.</li>
    </ol>
    <p><a href="#/laporan">Buka laporan &amp; kalkulator 50/30/20 &rarr;</a></p>
  </section>`;
}
