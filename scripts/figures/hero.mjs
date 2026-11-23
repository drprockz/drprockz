import { doc, panel, txt, chip, r1 } from '../lib/svg.mjs';

// The hero is a real 3D object: points on a sphere, joined to their nearest
// neighbours, rotated and projected with perspective once per frame. The
// frames are baked into SMIL <animate> value lists, so it turns in an <img>.
const N = 44, FRAMES = 24, DUR = 36;
const C = { x: 694, y: 208 }, R = 118, CAM = 3.4 * R;
const TILT = (22 * Math.PI) / 180, ROLL = (-14 * Math.PI) / 180;
const GATED = new Set([4, 13, 22, 31, 40]); // nodes that wait for a human

function mesh() {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts = Array.from({ length: N }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / N, rad = Math.sqrt(1 - y * y), th = golden * i;
    return [Math.cos(th) * rad, y, Math.sin(th) * rad];
  });
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const seen = new Set(), edges = [];
  pts.forEach((p, i) => {
    pts.map((q, j) => [dist(p, q), j]).filter(([, j]) => j !== i).sort((a, b) => a[0] - b[0]).slice(0, 3)
      .forEach(([, j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) { seen.add(key); edges.push([Math.min(i, j), Math.max(i, j)]); }
      });
  });
  return { pts, edges };
}

/** Screen position and depth (0 back .. 1 front) of a unit-sphere point at one frame. */
function project([x, y, z], frame) {
  const a = (2 * Math.PI * frame) / FRAMES;
  let X = x * Math.cos(a) + z * Math.sin(a), Z = -x * Math.sin(a) + z * Math.cos(a), Y = y;
  [Y, Z] = [Y * Math.cos(TILT) - Z * Math.sin(TILT), Y * Math.sin(TILT) + Z * Math.cos(TILT)];
  [X, Y] = [X * Math.cos(ROLL) - Y * Math.sin(ROLL), X * Math.sin(ROLL) + Y * Math.cos(ROLL)];
  const k = CAM / (CAM - Z * R);
  return { x: C.x + X * R * k, y: C.y + Y * R * k, t: (Z + 1) / 2 };
}

const anim = (attr, vals) => `<animate attributeName="${attr}" dur="${DUR}s" repeatCount="indefinite" values="${vals.join(';')}"/>`;
const r2 = (n) => Math.round(n * 100) / 100;

function sphere(t, animated) {
  const { pts, edges } = mesh();
  const frames = Array.from({ length: FRAMES + 1 }, (_, f) => pts.map((p) => project(p, f % FRAMES)));
  const f0 = frames[0];
  let out = '';
  for (const [i, j] of edges) {
    const a = f0[i], b = f0[j];
    const op = (f) => r2(0.05 + 0.5 * ((frames[f][i].t + frames[f][j].t) / 2) ** 1.6);
    out += `<line x1="${r1(a.x)}" y1="${r1(a.y)}" x2="${r1(b.x)}" y2="${r1(b.y)}" stroke="${t.ag}" stroke-width=".9" opacity="${op(0)}">`;
    if (animated) {
      out += anim('x1', frames.map((f) => r1(f[i].x))) + anim('y1', frames.map((f) => r1(f[i].y))) +
        anim('x2', frames.map((f) => r1(f[j].x))) + anim('y2', frames.map((f) => r1(f[j].y))) +
        anim('opacity', frames.map((_, f) => op(f)));
    }
    out += '</line>';
  }
  pts.forEach((_, i) => {
    const p = f0[i], gated = GATED.has(i);
    const rad = (f) => r1((gated ? 2.6 : 1.5) + 2.5 * frames[f][i].t);
    const op = (f) => r2(0.2 + 0.8 * frames[f][i].t ** 1.3);
    const paint = gated ? `fill="${t.bg}" stroke="${t.hu}" stroke-width="1.6"` : `fill="${t.ag}"`;
    out += `<circle cx="${r1(p.x)}" cy="${r1(p.y)}" r="${rad(0)}" ${paint} opacity="${op(0)}">`;
    if (animated) {
      out += anim('cx', frames.map((f) => r1(f[i].x))) + anim('cy', frames.map((f) => r1(f[i].y))) +
        anim('r', frames.map((_, f) => rad(f))) + anim('opacity', frames.map((_, f) => op(f)));
    }
    out += '</circle>';
  });
  return out;
}

export function hero(t) {
  const W = 880, H = 420;
  const css = `
.name{font-size:58px;font-weight:800;letter-spacing:-1.6px}
.role{font-size:17px}.tag{font-size:14px}
.blink{animation:blink 2.4s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
.still{display:none}
@media (prefers-reduced-motion:reduce){.spin{display:none}.still{display:inline}}
.core{transform-box:fill-box;transform-origin:center;animation:core 3.2s ease-in-out infinite}
@keyframes core{0%,100%{transform:scale(1);opacity:.95}50%{transform:scale(1.5);opacity:.6}}
.wave{fill:none;stroke:${t.ag};transform-box:fill-box;transform-origin:center;animation:wave 4.8s ease-out infinite}
@keyframes wave{0%{transform:scale(.25);opacity:.55}100%{transform:scale(1);opacity:0}}
.ring{fill:none;stroke:${t.fnt};stroke-dasharray:2 8;animation:ring 30s linear infinite}
@keyframes ring{to{stroke-dashoffset:-200}}
.bar{transform-box:fill-box;transform-origin:left;animation:bar 6s ease-in-out infinite}
@keyframes bar{0%,100%{transform:scaleX(1)}50%{transform:scaleX(2.4)}}
.hud{stroke:${t.fnt};fill:none;stroke-width:.8}
`;
  // tilted orbit: the back half is drawn before the mesh, the front half after it
  const orbit = (sweep) => `<path d="M${C.x - 168} ${C.y}A168 44 0 0 ${sweep} ${C.x + 168} ${C.y}" class="ring" transform="rotate(-16 ${C.x} ${C.y})"/>`;
  const sat = `<g transform="rotate(-16 ${C.x} ${C.y})"><circle r="3.6" fill="${t.hu}"><animateMotion dur="14s" repeatCount="indefinite" path="M${C.x - 168} ${C.y}A168 44 0 0 0 ${C.x + 168} ${C.y}A168 44 0 0 0 ${C.x - 168} ${C.y}"/></circle></g>`;

  const hud = [
    { label: '12 specialists', x: 530, y: 58, to: [628, 116], from: 'br' },
    { label: '5 event-driven', x: 744, y: 346, to: [772, 300], from: 'tl' },
    { label: '1 router', x: 530, y: 340, to: [C.x, C.y], from: 'tr' },
  ].map(({ label, x, y, to, from }) => {
    const c = chip(x, y, label, t, { fs: 11, h: 22 });
    const ax = from === 'tl' ? x + 22 : x + c.w - 22, ay = from === 'tl' || from === 'tr' ? y : y + 22;
    return `<path d="M${ax} ${ay}L${to[0]} ${to[1]}" class="hud"/><circle cx="${to[0]}" cy="${to[1]}" r="2.6" fill="${t.bg}" stroke="${t.fnt}"/>${c.svg}`;
  }).join('');

  const body = `${panel(W, H, t)}
<circle cx="${C.x}" cy="${C.y}" r="230" fill="url(#glow)"/>
<circle cx="52" cy="39.5" r="4" fill="${t.ag}" class="blink"/>
<text x="66" y="44" font-size="12.5"><tspan class="ink b">drprockz</tspan><tspan class="fnt" letter-spacing=".14em" dx="10">AI ENGINEER / MUMBAI, IN</tspan></text>
${txt(46, 170, 'Darshan Parmar', 's name ink')}
<text x="48" y="210" class="role"><tspan class="ag b">AI Engineer</tspan><tspan class="mut"> — agents, MCP, full-stack</tspan></text>
<rect x="48" y="226" width="44" height="3" rx="1.5" fill="url(#accent)" class="bar"/>
<text x="48" y="276" class="tag mut">I build AI agents that keep working while you’re away</text>
<text x="48" y="299" class="tag mut">— and <tspan class="hu b">stop to ask</tspan> before anything irreversible.</text>
<circle cx="52" cy="369" r="4" fill="${t.ag}"/>${txt(66, 373, 'runs on its own', 'mut', 'font-size="12"')}
<circle cx="213" cy="369" r="5" fill="none" stroke="${t.hu}" stroke-width="1.6"/>${txt(227, 373, 'waits for a human', 'mut', 'font-size="12"')}
${orbit(1)}
<circle cx="${C.x}" cy="${C.y}" r="${R}" class="wave"/><circle cx="${C.x}" cy="${C.y}" r="${R}" class="wave" style="animation-delay:-2.4s"/>
<circle cx="${C.x}" cy="${C.y}" r="46" fill="url(#coreglow)"/>
<g class="spin">${sphere(t, true)}</g><g class="still">${sphere(t, false)}</g>
<circle cx="${C.x}" cy="${C.y}" r="4.5" fill="${t.ink}" class="core"/>
${orbit(0)}${sat}
${hud}`;

  return doc({
    w: W, h: H, t, css, body,
    title: 'Darshan Parmar — AI Engineer',
    desc: 'I build AI agents that keep working while you are away, and stop to ask before anything irreversible. Illustration: a slowly rotating 3D mesh of agents around one router, with a few orange nodes that wait for a human.',
    defs: `<radialGradient id="glow"><stop offset="0" stop-color="${t.ag}" stop-opacity=".11"/><stop offset="1" stop-color="${t.ag}" stop-opacity="0"/></radialGradient>
<radialGradient id="coreglow"><stop offset="0" stop-color="${t.ag}" stop-opacity=".5"/><stop offset="1" stop-color="${t.ag}" stop-opacity="0"/></radialGradient>
<linearGradient id="accent"><stop offset="0" stop-color="${t.ag}"/><stop offset="1" stop-color="${t.hu}"/></linearGradient>`,
  });
}
