// KasRumah — main.js
// The router and the wiring: hash routes for every page, form handlers
// for every control, and one render that rebuilds the page from state.
// State lives in localStorage; render() is the only thing that writes HTML.

import { loadState, saveState, resetState } from './data.js';
import { dashboardView } from './views-dashboard.js';
import { transactionsView, addTransaction } from './views-transactions.js';
import { budgetsView, setBudget } from './views-budgets.js';
import { billsView, goalsView, addBill, addSaving, addGoal } from './views-bills.js';
import { reportView, settingsView, buildCsv } from './views-report.js';

let state = loadState();

const ROUTES = [
  { path: '/', title: 'Beranda', render: () => dashboardView(state) },
  { path: '/transaksi', title: 'Transaksi', render: (q) => transactionsView(state, q) },
  { path: '/anggaran', title: 'Anggaran', render: () => budgetsView(state) },
  { path: '/tagihan', title: 'Tagihan', render: () => billsView(state) },
  { path: '/tabungan', title: 'Tabungan', render: () => goalsView(state) },
  { path: '/laporan', title: 'Laporan', render: (q) => reportView(state, q) },
  { path: '/pengaturan', title: 'Pengaturan', render: () => settingsView(state) },
];

const NAV = [
  ['#/', 'Beranda'],
  ['#/transaksi', 'Transaksi'],
  ['#/anggaran', 'Anggaran'],
  ['#/tagihan', 'Tagihan'],
  ['#/tabungan', 'Tabungan'],
  ['#/laporan', 'Laporan'],
  ['#/pengaturan', 'Pengaturan'],
];

function currentRoute() {
  const hash = location.hash || '#/';
  const [path, qs] = hash.slice(1).split('?');
  const query = new URLSearchParams(qs || '');
  const route = ROUTES.find((r) => r.path === path) || ROUTES[0];
  return { route, path: route.path, query };
}

function render() {
  const { route, path, query } = currentRoute();
  document.title = `KasRumah — ${route.title} | Anggaran Rumah Tangga`;
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${path}`);
    if (a.getAttribute('href') === `#${path}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.getElementById('app').innerHTML = route.render(query);
  wire();
}

function note(message) {
  const el = document.getElementById('notice');
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  clearTimeout(note.timer);
  note.timer = setTimeout(() => { el.hidden = true; }, 4000);
}

function handleForm(form) {
  const action = form.dataset.action;
  const data = new FormData(form);
  let error = null;
  if (action === 'add-tx') error = addTransaction(state, data);
  else if (action === 'set-budget') error = setBudget(state, form.dataset.category, data);
  else if (action === 'add-bill') error = addBill(state, data);
  else if (action === 'add-saving') error = addSaving(state, form.dataset.goal, data);
  else if (action === 'add-goal') error = addGoal(state, data);
  else if (action === 'set-household') {
    const name = String(data.get('household') || '').trim();
    if (!name) error = 'Nama keluarga tidak boleh kosong.';
    else state.household = name;
  } else if (action === 'calc') {
    const income = Number(data.get('penghasilan'));
    if (!income || income <= 0) error = 'Penghasilan harus lebih dari Rp 0.';
    else {
      const url = new URL(location.href);
      url.hash = `#/laporan?penghasilan=${Math.round(income)}`;
      history.replaceState(null, '', url);
    }
  }
  if (error) {
    note(error);
    return;
  }
  saveState(state);
  if (action === 'add-tx') note('Transaksi tersimpan.');
  else if (action === 'set-budget') note('Anggaran diperbarui.');
  else if (action === 'add-bill') note('Tagihan ditambahkan.');
  else if (action === 'add-saving') note('Tabungan bertambah.');
  else if (action === 'add-goal') note('Tujuan baru dibuat.');
  else if (action === 'set-household') note('Nama keluarga disimpan.');
  render();
}

function wire() {
  document.querySelectorAll('#app form[data-action]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleForm(form);
    });
  });
  const filters = document.getElementById('tx-filters');
  if (filters) {
    filters.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(filters);
      const params = new URLSearchParams();
      if (data.get('kategori') && data.get('kategori') !== 'semua') params.set('kategori', data.get('kategori'));
      if (data.get('cari')) params.set('cari', data.get('cari'));
      location.hash = `#/transaksi${params.toString() ? `?${params}` : ''}`;
    });
  }
  document.querySelectorAll('[data-delete-tx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.transactions = state.transactions.filter((t) => t.id !== btn.dataset.deleteTx);
      saveState(state);
      note('Transaksi dihapus.');
      render();
    });
  });
  document.querySelectorAll('[data-pay-bill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bill = state.bills.find((b) => b.id === btn.dataset.payBill);
      if (bill) {
        bill.paid = true;
        bill.note = 'Ditandai lunas dari situs';
        saveState(state);
        note(`Tagihan ${bill.name} ditandai lunas.`);
        render();
      }
    });
  });
  const csv = document.getElementById('export-csv');
  if (csv) {
    csv.addEventListener('click', () => {
      const blob = new Blob([buildCsv(state)], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `kasrumah-transaksi-${state.month}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
      note('CSV bulan ini diunduh.');
    });
  }
  const reset = document.getElementById('reset-data');
  if (reset) {
    reset.addEventListener('click', () => {
      if (confirm('Kembalikan semua data ke contoh awal? Perubahanmu akan hilang.')) {
        state = resetState();
        saveState(state);
        note('Data contoh dikembalikan.');
        render();
      }
    });
  }
}

window.addEventListener('hashchange', render);
render();
