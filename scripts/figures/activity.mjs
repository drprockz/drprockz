import { doc, panel, txt, r1 } from '../lib/svg.mjs';
import { projector, box, quad } from '../lib/iso.mjs';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (n) => n.toLocaleString('en-US');

/** Blend two #rrggbb colours; k = 0 gives a, k = 1 gives b. */
function mix(a, b, k) {
  const ch = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(ch(a, i) * (1 - k) + ch(b, i) * k).toString(16).padStart(2, '0')).join('');
}

/**
 * Contribution skyline for the last year: one extruded bar per day.
 * @param t      theme tokens
 * @param data   { total, weeks: [[{date:'YYYY-MM-DD', count, weekday:0..6}]] }
 */
export function activity(t, data) {
  const W = 880, H = 404;
  const weeks = data.weeks, NW = weeks.length;
  // A shallow yaw keeps the 53-week axis close to horizontal.
  const YAW = 18, PITCH = 30, CELL = Math.min(14.4, 760 / (NW * 0.951 + 7 * 0.309));
  const p = projector({ ox: 60 + 7 * 0.309 * CELL, oy: 176, s: CELL, yaw: YAW, pitch: PITCH });
  const slope = (Math.atan2(Math.sin((YAW * Math.PI) / 180) * Math.sin((PITCH * Math.PI) / 180), Math.cos((YAW * Math.PI) / 180)) * 180) / Math.PI;

  const days = weeks.flat();
  const active = days.filter((d) => d.count > 0).length;
  let longest = 0, run = 0;
  for (const d of days) { run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  const best = Math.max(0, ...days.map((d) => d.count));

  // Colour by rank among active days, a quarter of them per step; height by
  // log, so one huge day does not flatten every ordinary one.
  const ranked = days.map((d) => d.count).filter(Boolean).sort((x, y) => x - y);
  const cut = [0.25, 0.5, 0.75].map((q) => ranked[Math.floor(q * (ranked.length - 1))] ?? 0);
  const level = (n) => (n === 0 ? 0 : 1 + cut.filter((c) => n > c).length);
  const height = (n) => 0.5 + 4.3 * (Math.log1p(n) / Math.log1p(Math.max(best, 1)));

  const css = `.big{font-size:30px;font-weight:800;letter-spacing:-.8px}.cap{font-size:11.5px}.mo{font-size:10.5px}
.wk{animation:wk 9s ease-in-out infinite}
@keyframes wk{0%,14%,100%{transform:translateY(0)}7%{transform:translateY(-5px)}}`;

  let b = panel(W, H, t, { fig: 'FIG. 03 — COMMIT SKYLINE, LAST 12 MONTHS', meta: 'REDRAWN DAILY BY GITHUB ACTIONS' });

  [[fmt(data.total), 'contributions'], [fmt(active), 'active days'], [`${fmt(longest)}d`, 'longest streak'], [fmt(best), 'busiest day']]
    .forEach(([n, cap], i) => {
      const x = 48 + i * 150;
      b += txt(x - 1, 92, n, `s big ${i === 0 ? 'ag' : 'ink'}`) + txt(x, 112, cap, 'mut cap');
    });

  // ground slab
  b += box(p, -0.7, -0.7, -0.35, NW + 1.2, 8.2, 0.35, t.iso.plate, { stroke: t.line });

  // bars, back to front: week by week, Sunday to Saturday
  const F = 0.8, k = t.name === 'dark' ? [0.38, 0.6] : [0.22, 0.42];
  const shades = t.heat.map((c) => [c, mix(c, t.shade, k[0]), mix(c, t.shade, k[1])]);
  weeks.forEach((week, wi) => {
    b += `<g class="wk" style="animation-delay:${r1(wi * 0.085)}s">`;
    for (const d of week) {
      b += d.count === 0
        ? quad(p, wi, d.weekday, 0.02, F, F, t.heat[0])
        : box(p, wi, d.weekday, 0, F, F, height(d.count), shades[level(d.count)]);
    }
    b += '</g>';
  });

  // month names run along the front edge of the slab
  const starts = [];
  weeks.forEach((week, wi) => {
    const m = Number(week[0].date.slice(5, 7)) - 1;
    if (!starts.length || starts.at(-1).m !== m) starts.push({ wi, m });
  });
  if (starts.length > 1 && starts[1].wi - starts[0].wi < 3) starts.shift();
  for (const { wi, m } of starts) {
    if (wi > NW - 2) continue;
    const [x, y] = p(wi, 8.9, -0.35);
    b += `<text x="${r1(x)}" y="${r1(y)}" class="fnt mo" transform="rotate(${r1(slope)} ${r1(x)} ${r1(y)})">${MONTHS[m]}</text>`;
  }

  const lx = 48, ly = H - 40;
  b += txt(lx, ly + 9, 'less', 'fnt mo');
  t.heat.forEach((c, i) => { b += `<rect x="${lx + 34 + i * 13}" y="${ly}" width="10" height="10" rx="2.5" fill="${c}"/>`; });
  b += txt(lx + 34 + 5 * 13 + 4, ly + 9, 'more · taller = more that day', 'fnt mo');

  return doc({
    w: W, h: H, t, css, body: b,
    title: 'Contribution skyline, last 12 months',
    desc: `${fmt(data.total)} contributions on ${fmt(active)} active days. Longest streak ${longest} days, busiest day ${fmt(best)} contributions.`,
  });
}
