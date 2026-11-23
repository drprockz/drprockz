import { doc, panel, txt, r1 } from '../lib/svg.mjs';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (n) => n.toLocaleString('en-US');

/**
 * Contribution heatmap for the last year.
 * @param t      theme tokens
 * @param data   { total, weeks: [[{date:'YYYY-MM-DD', count, weekday:0..6}]] }
 */
export function activity(t, data) {
  const W = 880, H = 290, PAD = 48;
  const weeks = data.weeks;
  const pitch = Math.min(14, Math.floor((W - PAD * 2) / weeks.length));
  const cell = pitch - 3;
  const gridW = weeks.length * pitch - 3;
  const X0 = Math.round((W - gridW) / 2), Y0 = 150;

  const days = weeks.flat();
  const active = days.filter((d) => d.count > 0).length;
  let longest = 0, run = 0;
  for (const d of days) { run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  const best = Math.max(0, ...days.map((d) => d.count));

  // Shade by rank among active days, a quarter of them per step. A few huge
  // days would otherwise push every ordinary day into the faintest shade.
  const ranked = days.map((d) => d.count).filter(Boolean).sort((x, y) => x - y);
  const cut = [0.25, 0.5, 0.75].map((q) => ranked[Math.floor(q * (ranked.length - 1))] ?? 0);
  const level = (n) => (n === 0 ? 0 : 1 + cut.filter((c) => n > c).length);

  const css = `.big{font-size:30px;font-weight:800;letter-spacing:-.8px}.cap{font-size:11.5px}.mo{font-size:10.5px}
.scan{fill:${t.ag};opacity:0;animation:scan 9s linear infinite}
@keyframes scan{0%{transform:translateX(0);opacity:0}4%{opacity:.16}92%{opacity:.16}100%{transform:translateX(${gridW}px);opacity:0}}`;

  let b = panel(W, H, t, { fig: 'FIG. 03 — COMMIT SIGNAL, LAST 12 MONTHS', meta: 'REDRAWN DAILY BY GITHUB ACTIONS' });

  const stats = [
    [fmt(data.total), 'contributions'],
    [fmt(active), 'active days'],
    [`${fmt(longest)}d`, 'longest streak'],
    [fmt(best), 'busiest day'],
  ];
  stats.forEach(([n, cap], i) => {
    const x = X0 + i * Math.round(gridW / 4);
    b += txt(x - 1, 92, n, `s big ${i === 0 ? 'ag' : 'ink'}`) + txt(x, 112, cap, 'mut cap');
  });

  // month labels sit above the grid; a first month of under three weeks gets none
  const starts = [];
  weeks.forEach((week, wi) => {
    const m = Number(week[0].date.slice(5, 7)) - 1;
    if (!starts.length || starts.at(-1).m !== m) starts.push({ wi, m });
  });
  if (starts.length > 1 && starts[1].wi - starts[0].wi < 3) starts.shift();
  for (const { wi, m } of starts) {
    if (wi <= weeks.length - 2) b += txt(X0 + wi * pitch, Y0 - 9, MONTHS[m], 'fnt mo');
  }
  weeks.forEach((week, wi) => {
    const x = X0 + wi * pitch;
    for (const d of week) {
      b += `<rect x="${x}" y="${Y0 + d.weekday * pitch}" width="${cell}" height="${cell}" rx="2.5" fill="${t.heat[level(d.count)]}"/>`;
    }
  });
  b += `<rect x="${X0}" y="${Y0 - 2}" width="3" height="${7 * pitch + 1}" rx="1.5" class="scan"/>`;

  const ly = Y0 + 7 * pitch + 6, lx = X0 + gridW;
  b += txt(lx, ly + 9, 'more', 'fnt mo', 'text-anchor="end"');
  t.heat.slice().reverse().forEach((c, i) => {
    b += `<rect x="${lx - 36 - (i + 1) * 13}" y="${ly}" width="10" height="10" rx="2.5" fill="${c}"/>`;
  });
  b += txt(lx - 36 - 5 * 13 - 8, ly + 9, 'less', 'fnt mo', 'text-anchor="end"');

  return doc({
    w: W, h: H, t, css, body: b,
    title: 'Contribution activity, last 12 months',
    desc: `${fmt(data.total)} contributions on ${fmt(active)} active days. Longest streak ${longest} days, busiest day ${fmt(best)} contributions.`,
  });
}
