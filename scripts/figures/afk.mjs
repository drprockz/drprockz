import { doc, panel, txt, chip } from '../lib/svg.mjs';

// The seven checks every Claude Code permission request passes through.
const CHAIN = [
  ['sensitive path', 'always ask', 'hu'],
  ['prompt injection', 'deny', 'stop'],
  ['destructive action', 'snapshot + defer', 'hu'],
  ['static rule', 'allow / deny', 'line'],
  ['anomaly', 'notify + defer', 'hu'],
  ['behavior prediction', 'auto ≥ 0.85', 'ag'],
  ['away fallback', 'ask by phone', 'hu'],
];

export function afkChain(t) {
  const W = 410, H = 372, STEP = 36, Y0 = 82, SLOT = 1.3, DUR = CHAIN.length * SLOT + 1.3;
  const pct = (s) => Math.round((s / DUR) * 1000) / 10;
  let mv = '';
  CHAIN.forEach((_, i) => {
    mv += `${pct(i * SLOT)}%,${pct(i * SLOT + SLOT * 0.7)}%{transform:translateY(${i * STEP}px);opacity:1}`;
  });
  const css = `.n{font-size:12px}
.tok{fill:${t.ag};animation:tok ${DUR}s ease-in-out infinite}
@keyframes tok{${mv}${pct(CHAIN.length * SLOT)}%,100%{transform:translateY(${(CHAIN.length - 1) * STEP}px);opacity:0}}
.hl{fill:${t.agSoft};opacity:0;animation:hl ${DUR}s linear infinite}
@keyframes hl{0%{opacity:0}1%,${pct(SLOT * 0.75)}%{opacity:1}${pct(SLOT)}%,100%{opacity:0}}`;
  let b = panel(W, H, t, { fig: 'FIG. 02 — AFK DECISION CHAIN' });
  b += `<path d="M44.5 ${Y0}V${Y0 + (CHAIN.length - 1) * STEP}" class="ln"/>`;
  CHAIN.forEach(([name, out, tone], i) => {
    const y = Y0 + i * STEP;
    b += `<rect x="28" y="${y - 15}" width="${W - 56}" height="30" rx="8" class="hl" style="animation-delay:${(i * SLOT).toFixed(2)}s"/>` +
      `<circle cx="44.5" cy="${y}" r="5" fill="${t.bg}" stroke="${t.fnt}" stroke-width="1.3"/>` +
      txt(62, y + 4, String(i + 1).padStart(2, '0'), 'fnt', 'font-size="11"') +
      txt(88, y + 4, name, 'ink n') +
      chip(W - 34, y - 11, out, t, { tone, anchor: 'end', fs: 10.5, h: 22, padX: 8 }).svg;
  });
  b += `<circle cx="44.5" cy="${Y0}" r="3" class="tok"/>`;
  b += `<path d="M28 ${H - 46}.5H${W - 28}" class="ln"/>` + txt(28, H - 22, 'every permission request · under 200 ms', 'mut', 'font-size="11.5"');
  return doc({
    w: W, h: H, t, css, body: b,
    title: 'AFK decision chain',
    desc: 'Seven checks in order: sensitive path (always ask), prompt injection (deny), destructive action (snapshot and defer), static rule (allow or deny), anomaly (notify and defer), behavior prediction (decide automatically at 0.85 confidence or higher), away fallback (ask by phone). Each request is decided in under 200 milliseconds.',
  });
}
