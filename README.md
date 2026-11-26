# KasRumah

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Kegelapan-ai/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Kegelapan-ai/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**KasRumah** is an original household budget site: a working budget book for
one Indonesian family — Keluarga Hartono, November 2026. It shows the month
at a glance (Rp 14.800.000 in, Rp 8.338.200 out, Rp 6.461.800 left), a
transaction book you can add to, filter and delete from, a budget for every
category with a live progress bar, bills with due dates you can mark paid,
savings goals you can top up, a month-against-month report with a 50/30/20
calculator, and a CSV export. Everything runs offline from its own files and
every change is saved in the browser — no account, no network request.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser, or open `app/index.html`
directly. No build step, no network request: the site is plain static files
under `app/`.

## Pages

- **Beranda** — the month at a glance, where the money went, bills due soon, latest transactions.
- **Transaksi** — the full book: filter by category, search, add and delete rows.
- **Anggaran** — a monthly limit per category, with spent vs. limit and an edit form for each.
- **Tagihan** — scheduled bills with due dates; mark each one paid.
- **Tabungan** — savings goals with progress; add money to a goal or create a new one.
- **Laporan** — this month vs. last month per category, a 50/30/20 calculator, CSV export.
- **Pengaturan** — rename the household, restore the sample data, about the site.

## Files

- `main.ts` — the entry program: copies `app/` and `screenshots/` to the
  output directory and writes `dossier.json` with the vendored make.fun
  library.
- `app/index.html` — the site, opened in a desktop browser or on a phone.
- `app/data.js` — the household's records and the localStorage store.
- `app/format.js` — rupiah, dates and small text helpers.
- `app/charts.js` — bar and donut charts drawn with plain HTML and CSS.
- `app/views-dashboard.js` — the home page.
- `app/views-transactions.js` — the transaction book.
- `app/views-budgets.js` — monthly limits per category.
- `app/views-bills.js` — bills and savings goals.
- `app/views-report.js` — the report, the 50/30/20 calculator, settings.
- `app/main.js` — hash router and all the wiring.
- `app/style.css` — the whole look, desktop and phone.
- `screenshots/` — real renders of the site's own code.

## Screenshots

1. `1-dashboard.jpg` — the home page at desktop size.
2. `2-transaksi.jpg` — the transaction book.
3. `3-anggaran.jpg` — budgets per category.
4. `4-phone.jpg` — the home page on a phone.

---

<sub>Entered on [make.fun](https://make.fun/?ref=okok&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
