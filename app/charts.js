// KasRumah — charts.js
// Charts drawn with plain HTML and CSS only: horizontal bars and a donut
// built from conic-gradient. No library, no canvas, no network — the same
// markup renders on desktop and on a phone.

import { rupiah, rupiahShort, pct, clamp, escapeHtml } from './format.js';

export function barRow(label, value, max, color, extra = '') {
  const width = clamp((value / max) * 100, 0, 100);
  return `<div class="bar-row">
    <div class="bar-label"><span>${escapeHtml(label)}</span><strong>${rupiah(value)}</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width:${width.toFixed(1)}%;background:${color}"></div></div>
    ${extra}
  </div>`;
}

export function donut(segments, centerTop, centerBottom) {
  if (!segments.length) return '<p class="muted">Belum ada pengeluaran bulan ini.</p>';
  const total = segments.reduce((a, s) => a + s.value, 0);
  let acc = 0;
  const stops = segments.map((s) => {
    const from = (acc / total) * 360;
    acc += s.value;
    const to = (acc / total) * 360;
    return `${s.color} ${from.toFixed(1)}deg ${to.toFixed(1)}deg`;
  });
  const legend = segments
    .map((s) => `<li><span class="dot" style="background:${s.color}"></span>${escapeHtml(s.label)}<strong>${pct(s.value, total)}%</strong></li>`)
    .join('');
  return `<div class="donut-wrap">
    <div class="donut" style="background:conic-gradient(${stops.join(',')})">
      <div class="donut-center"><span>${centerTop}</span><strong>${centerBottom}</strong></div>
    </div>
    <ul class="legend">${legend}</ul>
  </div>`;
}

export function categoryBars(byCategory, categories, budgets) {
  const max = Math.max(1, ...categories.map((c) => Math.max(byCategory[c.id] || 0, budgets[c.id] || 0)));
  return categories
    .map((c) => {
      const spent = byCategory[c.id] || 0;
      const limit = budgets[c.id] || 0;
      const over = spent > limit;
      return barRow(
        c.name,
        spent,
        max,
        over ? '#b3375a' : c.color,
        `<div class="bar-sub"><span>Anggaran ${rupiahShort(limit)}</span><span class="${over ? 'over' : ''}">${over ? `Lewat ${rupiahShort(spent - limit)}` : `Sisa ${rupiahShort(limit - spent)}`}</span></div>`,
      );
    })
    .join('');
}
