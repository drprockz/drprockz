import { doc, panel, txt, r1 } from '../lib/svg.mjs';

// One router, six specialists. Two of them (deploy, email) cannot finish
// without a human: their pulse parks at an orange gate until it is approved.
const NODES = [
  { label: 'code', deg: -90 },
  { label: 'review', deg: -30 },
  { label: 'test', deg: 30 },
  { label: 'deploy', deg: 90, gated: true },
  { label: 'email', deg: 150, gated: true },
  { label: 'research', deg: 210 },
];
const C = { x: 690, y: 204 }, R = 112, HUB = 36, CYCLE = 9;

export function hero(t) {
  const W = 880, H = 400;
  let css = `
.name{font-size:58px;font-weight:800;letter-spacing:-1.6px}
.role{font-size:17px}.tag{font-size:14px}
.blink{animation:blink 2.4s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
.orbit{stroke:${t.fnt};opacity:.55;fill:none;stroke-dasharray:2 9;animation:orbit 40s linear infinite}
@keyframes orbit{to{stroke-dashoffset:-220}}
.hubring{fill:none;stroke:${t.ag};transform-box:fill-box;transform-origin:center;animation:hub 3s ease-out infinite}
@keyframes hub{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.45)}}
.pulse{fill:${t.ag};opacity:0;animation-duration:${CYCLE}s;animation-iteration-count:infinite;animation-timing-function:linear}
.ping{fill:none;stroke:${t.ag};opacity:0;transform-box:fill-box;transform-origin:center;animation-duration:${CYCLE}s;animation-iteration-count:infinite}
.lit{fill:${t.ag};opacity:0;animation-duration:${CYCLE}s;animation-iteration-count:infinite}
.gate{fill:${t.bg};stroke:${t.hu};stroke-width:1.6;stroke-dasharray:52;animation-duration:${CYCLE}s;animation-iteration-count:infinite;animation-timing-function:linear}
@keyframes ping{0%,22%{opacity:0;transform:scale(1)}24%{opacity:.9}42%,100%{opacity:0;transform:scale(2.6)}}
@keyframes lit{0%,21%{opacity:0}24%,40%{opacity:1}52%,100%{opacity:0}}
@keyframes gping{0%,58%{opacity:0;transform:scale(1)}60%{opacity:.9}78%,100%{opacity:0;transform:scale(2.6)}}
@keyframes glit{0%,57%{opacity:0}60%,76%{opacity:1}88%,100%{opacity:0}}
@keyframes gate{0%,11%{stroke-dashoffset:52}44%,100%{stroke-dashoffset:0}}
`;
  let graph = `<circle cx="${C.x}" cy="${C.y}" r="${R}" class="orbit"/><circle cx="${C.x}" cy="${C.y}" r="${R + 34}" class="orbit" style="opacity:.3"/>`;
  let top = '';

  NODES.forEach((n, i) => {
    const a = (n.deg * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a);
    const sx = C.x + ux * HUB, sy = C.y + uy * HUB;
    const ex = C.x + ux * R, ey = C.y + uy * R;
    const dx = r1(ex - sx), dy = r1(ey - sy);
    const delay = `${r1(i * 1.35)}s`;
    graph += `<line x1="${r1(sx)}" y1="${r1(sy)}" x2="${r1(ex)}" y2="${r1(ey)}" class="ln"/>`;

    if (n.gated) {
      const gx = r1(dx * 0.5), gy = r1(dy * 0.5);
      css += `@keyframes mv${i}{0%{transform:translate(0,0);opacity:0}3%{opacity:1}11%,46%{transform:translate(${gx}px,${gy}px);opacity:1}57%{transform:translate(${dx}px,${dy}px);opacity:1}61%,100%{transform:translate(${dx}px,${dy}px);opacity:0}}`;
      const px = r1(sx + gx), py = r1(sy + gy);
      top += `<circle cx="${px}" cy="${py}" r="8.2" class="gate" style="animation-name:gate;animation-delay:${delay}" transform="rotate(-90 ${px} ${py})"/>` +
        `<path d="M${r1(px - 2.4)} ${r1(py - 3.2)}v6.4M${r1(px + 2.4)} ${r1(py - 3.2)}v6.4" stroke="${t.hu}" stroke-width="1.7" stroke-linecap="round"/>`;
    } else {
      css += `@keyframes mv${i}{0%{transform:translate(0,0);opacity:0}3%{opacity:1}21%{transform:translate(${dx}px,${dy}px);opacity:1}25%,100%{transform:translate(${dx}px,${dy}px);opacity:0}}`;
    }
    graph += `<circle cx="${r1(sx)}" cy="${r1(sy)}" r="3.2" class="pulse" style="animation-name:mv${i};animation-delay:${delay}"/>`;

    const ringCol = n.gated ? t.hu : t.ag;
    top += `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="6" class="ping" style="animation-name:${n.gated ? 'gping' : 'ping'};animation-delay:${delay}"/>` +
      `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="6" fill="${t.bg}" stroke="${ringCol}" stroke-width="1.5"/>` +
      `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="3.4" class="lit" style="animation-name:${n.gated ? 'glit' : 'lit'};animation-delay:${delay}"/>`;

    const lx = C.x + ux * (R + 22), ly = C.y + uy * (R + 22);
    const anchor = Math.abs(ux) < 0.3 ? 'middle' : ux > 0 ? 'start' : 'end';
    const yOff = Math.abs(ux) < 0.3 ? (uy < 0 ? -2 : 10) : 4;
    top += txt(lx, ly + yOff, n.label, 'mut', `font-size="12" text-anchor="${anchor}"`);
  });

  const hub = `<circle cx="${C.x}" cy="${C.y}" r="${HUB}" class="hubring"/>
<circle cx="${C.x}" cy="${C.y}" r="${HUB}" fill="${t.bg}" stroke="${t.ag}" stroke-width="1.6"/>
<circle cx="${C.x}" cy="${C.y}" r="${HUB - 7}" fill="${t.agSoft}"/>
${txt(C.x, C.y + 4.5, 'router', 'ink b', 'font-size="12.5" text-anchor="middle"')}`;

  const body = `${panel(W, H, t)}
<circle cx="${C.x}" cy="${C.y}" r="200" fill="url(#glow)"/>
<circle cx="52" cy="39.5" r="4" fill="${t.ag}" class="blink"/>
<text x="66" y="44" font-size="12.5"><tspan class="ink b">drprockz</tspan><tspan class="fnt" letter-spacing=".14em" dx="10">AI ENGINEER / MUMBAI, IN</tspan></text>
${txt(46, 164, 'Darshan Parmar', 's name ink')}
<text x="48" y="204" class="role"><tspan class="ag b">AI Engineer</tspan><tspan class="mut"> — agents, MCP, full-stack</tspan></text>
<text x="48" y="262" class="tag mut">I build AI agents that keep working while you’re away</text>
<text x="48" y="285" class="tag mut">— and <tspan class="hu b">stop to ask</tspan> before anything irreversible.</text>
<circle cx="52" cy="349" r="4" fill="${t.ag}"/>${txt(66, 353, 'runs on its own', 'mut', 'font-size="12"')}
<circle cx="213" cy="349" r="5" fill="none" stroke="${t.hu}" stroke-width="1.6"/>${txt(227, 353, 'waits for a human', 'mut', 'font-size="12"')}
${graph}${hub}${top}`;

  return doc({
    w: W, h: H, t,
    title: 'Darshan Parmar — AI Engineer',
    desc: 'I build AI agents that keep working while you are away, and stop to ask before anything irreversible. Diagram: a router dispatching work to code, review, test, deploy, email and research agents; deploy and email wait at a human approval gate.',
    css,
    defs: `<radialGradient id="glow"><stop offset="0" stop-color="${t.ag}" stop-opacity=".10"/><stop offset="1" stop-color="${t.ag}" stop-opacity="0"/></radialGradient>`,
    body,
  });
}
