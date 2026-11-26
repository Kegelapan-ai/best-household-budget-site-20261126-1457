// KasRumah — views-budgets.js
// Monthly limits per category: progress against the limit, and an edit
// form for each limit. Saving a limit re-renders every page that uses it.

import { CATEGORIES, monthTotals } from './data.js';
import { rupiah, rupiahShort, pct, clamp, escapeHtml } from './format.js';

export function budgetsView(state) {
  const t = monthTotals(state);
  const totalBudget = CATEGORIES.reduce((a, c) => a + (state.budgets[c.id] || 0), 0);
  return `<section class="page-head">
    <div><h1>Anggaran Bulanan</h1>
    <p class="lede">Batas belanja tiap kategori untuk November 2026. Total anggaran ${rupiah(totalBudget)} dari pemasukan ${rupiah(t.income)}.</p></div>
  </section>

  <div class="budget-list">
  ${CATEGORIES.map((c) => {
    const spent = t.byCategory[c.id] || 0;
    const limit = state.budgets[c.id] || 0;
    const used = pct(spent, limit);
    const over = spent > limit;
    return `<article class="card budget-card">
      <div class="budget-top">
        <h2><span class="dot" style="background:${c.color}"></span>${escapeHtml(c.name)}</h2>
        <strong class="${over ? 'over' : ''}">${rupiah(spent)} / ${rupiah(limit)}</strong>
      </div>
      <div class="meter big ${over ? 'over' : ''}"><div style="width:${clamp(used, 0, 100)}%"></div></div>
      <p class="muted">${used}% terpakai &middot; ${over ? `lewat ${rupiah(spent - limit)}` : `sisa ${rupiah(limit - spent)}`}</p>
      <form class="budget-form" data-action="set-budget" data-category="${c.id}">
        <label>Ubah anggaran (Rp)
          <input type="number" name="limit" min="0" step="50000" value="${limit}" required>
        </label>
        <button class="btn small" type="submit">Simpan</button>
      </form>
    </article>`;
  }).join('')}
  </div>

  <section class="card">
    <h2>Cara keluarga ini menyusun anggaran</h2>
    <p>Anggaran disusun di awal bulan dari gaji yang sudah pasti masuk, bukan dari sisa.
    Belanja harian mendapat porsi terbesar (${rupiahShort(state.budgets.belanja)}) karena makan tiga kali sehari untuk empat orang.
    Tagihan rumah (${rupiahShort(state.budgets.tagihan)}) dipatok dari rata-rata tiga bulan terakhir: listrik, air, internet, dan iuran BPJS.
    Kalau satu kategori lewat, keluarga menutupnya dari kategori Hiburan dulu — bukan dari Dana Darurat.</p>
    <p><a href="#/laporan">Lihat apakah anggaran ini cocok dengan aturan 50/30/20 &rarr;</a></p>
  </section>`;
}

export function setBudget(state, categoryId, form) {
  const limit = Math.round(Number(form.get('limit')));
  if (!Number.isFinite(limit) || limit < 0) return 'Anggaran harus angka Rp 0 atau lebih.';
  if (!CATEGORIES.some((c) => c.id === categoryId)) return 'Kategori tidak dikenal.';
  state.budgets[categoryId] = limit;
  return null;
}
