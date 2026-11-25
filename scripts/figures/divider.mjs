import { doc } from '../lib/svg.mjs';

/** Section divider: a signal line with one blip, and a bright segment that keeps travelling along it. */
export function divider(t) {
  const W = 880, H = 28;
  const d = 'M0 14H392l8-9 9 17 9-13 7 5H880';
  const css = `.base{stroke:url(#fade);fill:none;stroke-width:1.2}
.run{stroke:${t.ag};fill:none;stroke-width:1.6;stroke-linecap:round;stroke-dasharray:46 1000;animation:run 6s linear infinite}
@keyframes run{from{stroke-dashoffset:60}to{stroke-dashoffset:-940}}`;
  const body = `<path d="${d}" class="base"/><path d="${d}" class="run"/>`;
  return doc({
    w: W, h: H, t, css, body, title: 'divider',
    defs: `<linearGradient id="fade" gradientUnits="userSpaceOnUse" x1="0" x2="${W}"><stop offset="0" stop-color="${t.ag}" stop-opacity="0"/><stop offset=".42" stop-color="${t.ag}" stop-opacity=".8"/><stop offset=".58" stop-color="${t.hu}" stop-opacity=".8"/><stop offset="1" stop-color="${t.hu}" stop-opacity="0"/></linearGradient>`,
  });
}
