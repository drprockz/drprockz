import { MONO, SANS } from './theme.mjs';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const r1 = (n) => Math.round(n * 10) / 10;
/** Advance width of one monospace glyph. Every stack in MONO is ~0.6em. */
export const cw = (fs) => fs * 0.602;

const baseCss = (t) => `
text{font-family:${MONO};fill:${t.ink}}
.s{font-family:${SANS}}
.b{font-weight:700}
.ink{fill:${t.ink}}.mut{fill:${t.mut}}.fnt{fill:${t.fnt}}.ag{fill:${t.ag}}.hu{fill:${t.hu}}.st{fill:${t.stop}}
.lbl{font-size:10.5px;letter-spacing:.14em;fill:${t.fnt}}
.box{fill:${t.bg2};stroke:${t.line}}
.ln{stroke:${t.line};fill:none}
.sag{stroke:${t.ag};fill:none}.shu{stroke:${t.hu};fill:none}
.flow{stroke-dasharray:3 7;animation:flow 1.1s linear infinite}
@keyframes flow{to{stroke-dashoffset:-20}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

export function doc({ w, h, t, title, desc = '', css = '', defs = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-size="12" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
<style>${baseCss(t)}${css}</style>
<defs><pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${t.grid}"/></pattern>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.ag}" stop-opacity=".55"/><stop offset=".3" stop-color="${t.line}"/><stop offset=".7" stop-color="${t.line}"/><stop offset="1" stop-color="${t.hu}" stop-opacity=".5"/></linearGradient>${defs}</defs>
${body}
</svg>
`;
}

/** Rounded panel: dot grid, a border that runs teal to orange corner to corner, optional figure label. */
export function panel(w, h, t, { fig = '', meta = '' } = {}) {
  return `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="14" fill="${t.bg}" stroke="url(#edge)"/>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="13" fill="url(#dots)"/>
${fig ? `<text x="28" y="36" class="lbl">${esc(fig)}</text>` : ''}
${meta ? `<text x="${w - 28}" y="36" class="lbl" text-anchor="end">${esc(meta)}</text>` : ''}`;
}

export const txt = (x, y, s, cls = '', attrs = '') =>
  `<text x="${r1(x)}" y="${r1(y)}"${cls ? ` class="${cls}"` : ''}${attrs ? ' ' + attrs : ''}>${esc(s)}</text>`;

const chipW = (label, fs, padX) => Math.ceil(label.length * cw(fs) + padX * 2) + 2;

/** One pill. `tone` picks the outline: line | ag | hu | stop. Returns {svg,w}. */
export function chip(x, y, label, t, { fs = 11, padX = 9, h = 22, tone = 'line', anchor = 'start' } = {}) {
  const w = chipW(label, fs, padX);
  const x0 = anchor === 'end' ? x - w : x;
  const stroke = { line: t.line, ag: t.ag, hu: t.hu, stop: t.stop }[tone];
  const fill = { line: t.bg2, ag: t.agSoft, hu: t.huSoft, stop: 'none' }[tone];
  const cls = { line: 'mut', ag: 'ag', hu: 'hu', stop: 'st' }[tone];
  return {
    w,
    svg: `<rect x="${r1(x0) + 0.5}" y="${r1(y) + 0.5}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}"/>` +
      `<text x="${r1(x0 + w / 2)}" y="${r1(y + h / 2 + fs * 0.36)}" class="${cls}" font-size="${fs}" text-anchor="middle">${esc(label)}</text>`,
  };
}

/** Left-to-right wrapping row of chips. Items are strings or [label, tone]. Returns {svg,height}. */
export function chipWrap(items, t, { x, y, maxW, fs = 11, padX = 9, h = 22, gap = 7, rowGap = 8 }) {
  let cx = x, cy = y, out = '';
  for (const it of items) {
    const [label, tone] = Array.isArray(it) ? it : [it, 'line'];
    const w = chipW(label, fs, padX);
    if (cx + w > x + maxW && cx > x) { cx = x; cy += h + rowGap; }
    out += chip(cx, cy, label, t, { fs, padX, h, tone }).svg;
    cx += w + gap;
  }
  return { svg: out, height: cy - y + h };
}
