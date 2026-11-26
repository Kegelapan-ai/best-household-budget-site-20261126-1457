// KasRumah — views-transactions.js
// The transaction book: filter by category and text, add a row, delete a
// row. The totals at the top always come from the rows actually shown.

import { CATEGORIES, monthTotals, monthTransactions, categoryName, categoryColor, newId } from './data.js';
import { rupiah, dateLong, escapeHtml } from './format.js';

export function transactionsView(state, query) {
  const t = monthTotals(state);
  const cat = query.get('kategori') || 'semua';
  const q = (query.get('cari') || '').toLowerCase();
  let rows = monthTransactions(state).slice().sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  if (cat !== 'semua') rows = rows.filter((r) => r.category === cat);
  if (q) rows = rows.filter((r) => r.note.toLowerCase().includes(q) || categoryName(r.category).toLowerCase().includes(q));
  const shownIn = rows.filter((r) => r.kind === 'income').reduce((a, r) => a + r.amount, 0);
  const shownOut = rows.filter((r) => r.kind === 'expense').reduce((a, r) => a + r.amount, 0);

  return `<section class="page-head">
    <div><h1>Transaksi</h1>
    <p class="lede">Semua pemasukan dan pengeluaran ${escapeHtml(state.household)} bulan ini — ${rows.length} baris ditampilkan.</p></div>
    <div class="totals">
      <div><span>Masuk</span><strong class="in">${rupiah(t.income)}</strong></div>
      <div><span>Keluar</span><strong class="out">${rupiah(t.expense)}</strong></div>
      <div><span>Sisa</span><strong>${rupiah(t.left)}</strong></div>
    </div>
  </section>

  <form class="card form-grid" id="tx-form" data-action="add-tx">
    <h2>Catat transaksi baru</h2>
    <label>Tanggal <input type="date" name="date" value="2026-11-27" required></label>
    <label>Jenis <select name="kind"><option value="expense">Pengeluaran</option><option value="income">Pemasukan</option></select></label>
    <label>Kategori <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}</select></label>
    <label>Catatan <input type="text" name="note" placeholder="cth: Pasar Tradisional — sayur" required maxlength="80"></label>
    <label>Jumlah (Rp) <input type="number" name="amount" min="1000" step="500" placeholder="150000" required></label>
    <div><button class="btn primary" type="submit">Simpan transaksi</button></div>
    <p class="muted small form-note" id="tx-form-note">Tersimpan di browser ini saja — tidak dikirim ke mana-mana.</p>
  </form>

  <div class="card">
    <form class="filters" id="tx-filters" data-action="filter-tx">
      <label>Kategori
        <select name="kategori">
          <option value="semua">Semua kategori</option>
          ${CATEGORIES.map((c) => `<option value="${c.id}" ${cat === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
        </select>
      </label>
      <label>Cari <input type="search" name="cari" value="${escapeHtml(query.get('cari') || '')}" placeholder="cth: pasar, listrik…"></label>
      <button class="btn" type="submit">Terapkan</button>
      <a class="btn ghost" href="#/transaksi">Reset</a>
    </form>
    <p class="muted">Ditampilkan: masuk ${rupiah(shownIn)} &middot; keluar ${rupiah(shownOut)}</p>
    ${rows.length ? `<table class="tx-table">
      <thead><tr><th>Tanggal</th><th>Catatan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
      <tbody>${rows.map((r) => `<tr>
        <td>${dateLong(r.date)}</td>
        <td>${escapeHtml(r.note)}</td>
        <td><span class="chip" style="--chip:${categoryColor(r.category)}">${categoryName(r.category)}</span></td>
        <td class="num ${r.kind === 'income' ? 'in' : 'out'}">${r.kind === 'income' ? '+' : '&minus;'}${rupiah(r.amount)}</td>
        <td><button class="btn small danger" data-delete-tx="${r.id}">Hapus</button></td>
      </tr>`).join('')}</tbody>
    </table>` : '<p class="muted">Tidak ada transaksi yang cocok dengan filter ini. Ubah kategori atau kata pencarian.</p>'}
  </div>`;
}

export function addTransaction(state, form) {
  const amount = Math.round(Number(form.get('amount')));
  if (!amount || amount <= 0) return 'Jumlah harus lebih dari Rp 0.';
  const note = String(form.get('note') || '').trim();
  if (!note) return 'Catatan tidak boleh kosong.';
  const date = String(form.get('date') || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Tanggal tidak valid.';
  state.transactions.push({
    id: newId('t', state),
    date,
    kind: form.get('kind') === 'income' ? 'income' : 'expense',
    category: String(form.get('category') || 'lainnya'),
    note,
    amount,
  });
  return null;
}
