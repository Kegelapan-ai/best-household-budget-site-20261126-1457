// KasRumah — views-bills.js
// Two pages in one file because they share the same idea: money with a
// date attached. Bills: what must be paid and when. Savings: what the
// family is building toward, and how far along each goal is.

import { monthTotals } from './data.js';
import { rupiah, pct, clamp, dateLong, dateShort, escapeHtml } from './format.js';

export function billsView(state) {
  const unpaid = state.bills.filter((b) => !b.paid);
  const paid = state.bills.filter((b) => b.paid);
  const unpaidTotal = unpaid.reduce((a, b) => a + b.amount, 0);
  const paidTotal = paid.reduce((a, b) => a + b.amount, 0);
  const sorted = [...unpaid].sort((a, b) => a.due.localeCompare(b.due));
  return `<section class="page-head">
    <div><h1>Tagihan &amp; Pengingat</h1>
    <p class="lede">Masih harus dibayar bulan ini: ${rupiah(unpaidTotal)} (${unpaid.length} tagihan). Sudah lunas: ${rupiah(paidTotal)}.</p></div>
  </section>

  <form class="card form-grid" data-action="add-bill">
    <h2>Tambah tagihan</h2>
    <label>Nama tagihan <input type="text" name="name" placeholder="cth: Iuran sampah" required maxlength="60"></label>
    <label>Jumlah (Rp) <input type="number" name="amount" min="1000" step="1000" placeholder="75000" required></label>
    <label>Jatuh tempo <input type="date" name="due" value="2026-11-30" required></label>
    <label>Catatan <input type="text" name="note" placeholder="cth: Bayar ke bendahara RT" maxlength="80"></label>
    <div><button class="btn primary" type="submit">Tambah tagihan</button></div>
  </form>

  <div class="card">
    <h2>Belum dibayar</h2>
    ${sorted.length ? `<ul class="bill-list big">${sorted.map((b) => `<li>
      <div><strong>${escapeHtml(b.name)}</strong><span class="muted">${escapeHtml(b.note || '')} &middot; jatuh tempo ${dateLong(b.due)}</span></div>
      <div class="bill-actions"><strong>${rupiah(b.amount)}</strong>
      <button class="btn small primary" data-pay-bill="${b.id}">Tandai lunas</button></div></li>`).join('')}</ul>`
      : '<p class="ok">Semua tagihan sudah lunas. Bulan ini beres.</p>'}
  </div>

  <div class="card">
    <h2>Sudah lunas</h2>
    <ul class="bill-list">${[...paid].sort((a, b) => b.due.localeCompare(a.due)).map((b) => `<li>
      <div><strong>${escapeHtml(b.name)}</strong><span class="muted">${escapeHtml(b.note || '')} &middot; ${dateShort(b.due)}</span></div>
      <strong class="muted">${rupiah(b.amount)} &middot; Lunas</strong></li>`).join('')}</ul>
  </div>`;
}

export function goalsView(state) {
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const left = monthTotals(state).left;
  return `<section class="page-head">
    <div><h1>Tabungan &amp; Tujuan</h1>
    <p class="lede">Terkumpul ${rupiah(totalSaved)} dari target ${rupiah(totalTarget)} (${pct(totalSaved, totalTarget)}%). Sisa bulan ini ${rupiah(left)} bisa menambah tabungan.</p></div>
  </section>

  <div class="goal-list">
  ${state.goals.map((g) => {
    const p = pct(g.saved, g.target);
    return `<article class="card goal-card">
      <div class="goal-top"><h2>${escapeHtml(g.name)}</h2><strong>${p}%</strong></div>
      <p class="muted">${escapeHtml(g.note)}</p>
      <div class="meter big"><div style="width:${clamp(p, 0, 100)}%"></div></div>
      <p><strong>${rupiah(g.saved)}</strong> dari ${rupiah(g.target)} &middot; kurang ${rupiah(g.target - g.saved)}</p>
      <form class="goal-form" data-action="add-saving" data-goal="${g.id}">
        <label>Tambah tabungan (Rp)
          <input type="number" name="amount" min="1000" step="10000" placeholder="250000" required>
        </label>
        <button class="btn small primary" type="submit">Tambah</button>
      </form>
    </article>`;
  }).join('')}
  </div>

  <form class="card form-grid" data-action="add-goal">
    <h2>Buat tujuan baru</h2>
    <label>Nama tujuan <input type="text" name="name" placeholder="cth: Biaya masuk sekolah" required maxlength="60"></label>
    <label>Target (Rp) <input type="number" name="target" min="10000" step="10000" placeholder="5000000" required></label>
    <label>Catatan <input type="text" name="note" placeholder="cth: Untuk tahun ajaran baru" maxlength="80"></label>
    <div><button class="btn primary" type="submit">Buat tujuan</button></div>
  </form>`;
}

export function addBill(state, form) {
  const amount = Math.round(Number(form.get('amount')));
  if (!amount || amount <= 0) return 'Jumlah harus lebih dari Rp 0.';
  const name = String(form.get('name') || '').trim();
  if (!name) return 'Nama tagihan tidak boleh kosong.';
  const due = String(form.get('due') || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return 'Tanggal jatuh tempo tidak valid.';
  state.bills.push({ id: `b${Date.now().toString(36)}`, name, amount, due, paid: false, note: String(form.get('note') || '').trim() });
  return null;
}

export function addSaving(state, goalId, form) {
  const amount = Math.round(Number(form.get('amount')));
  if (!amount || amount <= 0) return 'Jumlah harus lebih dari Rp 0.';
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return 'Tujuan tidak ditemukan.';
  goal.saved += amount;
  return null;
}

export function addGoal(state, form) {
  const target = Math.round(Number(form.get('target')));
  if (!target || target <= 0) return 'Target harus lebih dari Rp 0.';
  const name = String(form.get('name') || '').trim();
  if (!name) return 'Nama tujuan tidak boleh kosong.';
  state.goals.push({ id: `g${Date.now().toString(36)}`, name, target, saved: 0, note: String(form.get('note') || '').trim() });
  return null;
}
