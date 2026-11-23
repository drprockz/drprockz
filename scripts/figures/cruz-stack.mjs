import { doc, panel, txt, r1 } from '../lib/svg.mjs';
import { projector, box, topFace, quad } from '../lib/iso.mjs';

// CRUZ as an exploded isometric stack: four plates, drawn bottom-up so each
// plate hides the beams that pass behind it.
// GAP_PX has to exceed the plate's on-screen depth, or a plate hides what stands on the one below.
const S = 26, GAP_PX = 130, PW = 7, PD = 4, PT = 0.26;
const OX = 204, OY = 96;

const CALLOUTS = [
  ['01 / INTERFACE', 'One conversation, any device', ['voice with wake word · web and PWA · Telegram']],
  ['02 / ROUTER', 'CruzAgent', ['Claude’s tool call is the routing decision.', 'No router model, no extra hop.']],
  ['03 / SPECIALISTS', '12 agents, called as tools, in parallel', ['code · review · tests · docs · research · planning', '+ 5 event-driven agents on schedules and webhooks']],
  ['04 / MEMORY', 'Four layers, from context to vectors', ['working · session · semantic · procedural']],
];

export function cruzStack(t) {
  const W = 880, H = 648;
  const zUnit = S * Math.cos((35.264 * Math.PI) / 180);
  const plateP = (k) => projector({ ox: OX, oy: OY + k * GAP_PX, s: S });
  const P = [0, 1, 2, 3].map(plateP);
  let css = `.ct{font-size:16.5px;font-weight:700}.cd{font-size:12px}
.float{animation:float 4s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.shadow{transform-box:fill-box;transform-origin:center;animation:shadow 4s ease-in-out infinite}
@keyframes shadow{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(.82);opacity:.28}}
.lit{opacity:0;animation:lit 7.2s linear infinite}
@keyframes lit{0%,100%{opacity:0}4%,14%{opacity:.85}22%{opacity:0}}
.gate{animation:gate 2.4s ease-in-out infinite}
@keyframes gate{0%,100%{opacity:.25}50%{opacity:1}}
.pl{opacity:0;animation-duration:7.2s;animation-iteration-count:infinite;animation-timing-function:linear}
.beam{stroke-width:1;opacity:.7}`;
  const edge = t.line;
  const plate = (p) => box(p, 0, 0, -PT, PW, PD, PT, t.iso.plate, { stroke: edge }) +
    quad(p, 0.35, 0.35, 0, PW - 0.7, PD - 0.7, 'none', `stroke="${t.line}" stroke-width=".7" stroke-dasharray="2 4"`);
  const line = (a, b, cls = 'sag') => `<path d="M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}" class="${cls} beam flow"/>`;
  let pulseN = 0;
  /** A dot that travels a -> b once per cycle, starting at `at` seconds. */
  const pulse = (a, b, at, color) => {
    const i = pulseN++, dx = r1(b[0] - a[0]), dy = r1(b[1] - a[1]);
    css += `@keyframes pm${i}{0%{transform:translate(0,0);opacity:0}2%{opacity:1}12%{transform:translate(${dx}px,${dy}px);opacity:1}15%,100%{transform:translate(${dx}px,${dy}px);opacity:0}}`;
    return `<circle cx="${r1(a[0])}" cy="${r1(a[1])}" r="3" fill="${color}" class="pl" style="animation-name:pm${i};animation-delay:${at}s"/>`;
  };

  let b = panel(W, H, t, { fig: 'FIG. 01 — CRUZ, EXPLODED VIEW', meta: 'PRIVATE REPO' });

  // ── plate 3: memory, four slabs of growing depth ──────────────────────────
  const mem = [0.45, 0.95, 1.45, 1.95];
  b += plate(P[3]);
  mem.forEach((h, i) => {
    const x = 0.6 + i * 1.55;
    b += box(P[3], x, 0.6, 0, 1.2, 2.8, h, t.iso.dim, { stroke: edge }) +
      topFace(P[3], x, 0.6, 0, 1.2, 2.8, h, t.ag, `opacity="${0.16 + i * 0.24}"`);
  });

  // ── plate 2: twelve specialists; the two orange ones wait for approval ────
  const cubes = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) cubes.push({ i, j, x: 0.6 + i * 1.62, y: 0.35 + j * 1.2, gated: i === 3 && j > 0 });
  const hubBottom = P[1](PW / 2, PD / 2, -PT);
  const memTop = P[3](PW / 2, PD / 2, 1);
  b += line(P[2](PW / 2, PD / 2, -PT), memTop) + pulse(P[2](PW / 2, PD / 2, -PT), memTop, 2.6, t.ag);
  b += plate(P[2]);
  cubes.forEach((c, n) => {
    const top = P[2](c.x + 0.45, c.y + 0.45, 0.9);
    b += line(hubBottom, top, c.gated ? 'shu' : 'sag');
    if (n % 3 === 0 || c.gated) b += pulse(hubBottom, top, 1.2 + (n % 4) * 0.25, c.gated ? t.hu : t.ag);
  });
  cubes.forEach((c, n) => {
    b += box(P[2], c.x, c.y, 0, 0.9, 0.9, 0.9, c.gated ? t.iso.hu : t.iso.dim, { stroke: c.gated ? '' : edge });
    b += c.gated
      ? topFace(P[2], c.x, c.y, 0, 0.9, 0.9, 0.9, '#fff', 'class="gate" style="mix-blend-mode:soft-light"')
      : topFace(P[2], c.x, c.y, 0, 0.9, 0.9, 0.9, t.ag, `class="lit" style="animation-delay:${r1(1.9 + ((n * 5) % 12) * 0.42)}s"`);
  });

  // ── plate 1: the router, one floating cube ────────────────────────────────
  const cubeTop = P[1](PW / 2, PD / 2, 2.75);
  b += plate(P[1]);
  const sh = P[1](PW / 2, PD / 2, 0);
  b += `<ellipse cx="${r1(sh[0])}" cy="${r1(sh[1])}" rx="40" ry="22" fill="${t.ag}" class="shadow" opacity=".4" filter="url(#blur)"/>`;
  b += `<g class="float">${box(P[1], PW / 2 - 1, PD / 2 - 1, 0.7, 2, 2, 2, t.iso.ag)}` +
    quad(P[1], PW / 2 - 0.5, PD / 2 - 0.5, 2.7, 1, 1, 'none', `stroke="${t.bg}" stroke-width="1.6" opacity=".55"`) + '</g>';

  // ── plate 0: three ways in ────────────────────────────────────────────────
  const inDrop = P[0](PW / 2, PD / 2, -PT);
  b += line(inDrop, cubeTop) + pulse(inDrop, cubeTop, 0, t.ag);
  b += plate(P[0]);
  [0.7, 2.75, 4.8].forEach((x, i) => {
    b += box(P[0], x, 1.25, 0, 1.5, 1.5, 0.32, t.iso.dim, { stroke: edge }) +
      quad(P[0], x + 0.38, 1.63, 0.33, 0.74, 0.74, t.ag, `class="gate" style="animation-delay:${-i * 0.8}s"`);
  });

  // ── callouts ──────────────────────────────────────────────────────────────
  CALLOUTS.forEach(([label, title, lines], k) => {
    const corner = P[k](PW, 0, 0), y = corner[1], x = 456;
    b += `<path d="M${r1(corner[0] + 8)} ${r1(y)}H${x - 18}" class="ln"/><circle cx="${r1(corner[0] + 8)}" cy="${r1(y)}" r="2.6" fill="${t.bg}" stroke="${t.fnt}"/><circle cx="${x - 18}" cy="${r1(y)}" r="2.6" fill="${k === 1 ? t.ag : t.fnt}"/>`;
    b += txt(x, y - 22, label, 'lbl') + txt(x, y + 2, title, 's ct ink');
    lines.forEach((s, i) => { b += txt(x, y + 24 + i * 18, s, 'mut cd'); });
    if (k === 2) {
      const ly = y + 24 + lines.length * 18;
      b += `<rect x="${x}" y="${ly - 9}" width="9" height="9" rx="2" fill="${t.hu}"/>` + txt(x + 16, ly, 'deploys and email wait for a human', 'hu cd');
    }
  });

  return doc({
    w: W, h: H, t, css, body: b,
    defs: '<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>',
    title: 'CRUZ, exploded view',
    desc: 'Four stacked layers. Interface: voice with wake word, web and PWA, Telegram. Router: CruzAgent, where Claude\'s tool call is the routing decision. Specialists: twelve agents called as tools in parallel, plus five event-driven agents; deploys and email wait for a human. Memory: four layers, working, session, semantic and procedural.',
  });
}
