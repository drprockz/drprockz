import { doc, panel, txt, chip, cw, esc, r1 } from '../lib/svg.mjs';

// ── FIG. 01 — request path, event loop, memory and model routing ────────────
// Third column holds the two agents whose work is irreversible, so their
// connectors can run straight into the approval gate.
const SPECIALISTS = [
  ['forge', 'code'], ['sentinel', 'review'], ['echo', 'email', 1],
  ['qt', 'tests'], ['mark', 'docs'], ['titan', 'deploys', 1],
  ['reach', 'outreach'], ['catch', 'meetings'], ['pm', 'sprints'],
  ['raw', 'research'], ['pulse', 'briefing'], ['calendar', 'events'],
];
const EVENT_AGENTS = [
  ['reply_triage', 'gmail webhook'], ['meeting_prep', 'calendar webhook'], ['funded_watcher', 'daily feed'],
  ['health_guardian', 'nightly'], ['shiplog', 'weekly report'],
];
const MEMORY = [
  ['working', 'ctx window', 'this turn'], ['session', 'postgres', 'conversation'],
  ['semantic', 'qdrant', 'all time'], ['procedural', 'prefs jsonb', 'all time'],
];
const MODELS = [
  ['Claude Sonnet', 'routing · hard code · review'],
  ['Qwen · Llama (local)', 'drafts · docs · tests · $0'],
  ['Gemini Flash', 'lead discovery'],
];

const flow = (d, tone = 'sag') => `<path d="${d}" class="${tone}" opacity=".28"/><path d="${d}" class="${tone} flow"/>`;

export function cruzArchitecture(t) {
  const W = 880, H = 572;
  const css = `.h{font-size:15px;font-weight:700}.n{font-size:11.5px}.r{font-size:10px}
.gatebox{fill:${t.huSoft};stroke:${t.hu}}.gated{fill:${t.bg2};stroke:${t.hu}}`;
  let b = panel(W, H, t, { fig: 'FIG. 01 — CRUZ: REQUEST PATH, EVENT LOOP, MEMORY', meta: 'PRIVATE REPO' });

  // inputs
  b += txt(32, 78, 'INPUT', 'lbl');
  ['voice · wake word', 'web · PWA', 'Telegram'].forEach((s, i) => {
    const y = 92 + i * 46;
    b += `<rect x="32.5" y="${y}.5" width="140" height="34" rx="8" class="box"/>` + txt(46, y + 21.5, s, 'mut n');
    b += flow(`M172.5 ${y + 17.5}H192.5V155.5H212`);
  });

  // router
  b += txt(212, 78, 'ROUTER', 'lbl');
  b += `<rect x="212.5" y="92.5" width="200" height="172" rx="10" fill="${t.agSoft}" stroke="${t.ag}"/>`;
  b += txt(228, 122, 'CruzAgent', 'ink h s');
  b += txt(228, 146, 'Claude + native tool_use', 'ag n');
  b += txt(228, 172, 'No separate router LLM —', 'mut n') + txt(228, 189, 'the tool call itself is', 'mut n') + txt(228, 206, 'the routing decision.', 'mut n');
  b += `<rect x="228.5" y="224.5" width="168" height="26" rx="6" fill="${t.bg}" stroke="${t.line}"/>` + txt(312, 241.5, 'classify() pre-filter', 'mut', 'font-size="11" text-anchor="middle"');
  b += flow('M412.5 155.5H452');

  // specialists
  b += txt(452, 78, '12 SPECIALISTS · CALLED AS TOOLS', 'lbl');
  SPECIALISTS.forEach(([name, role, gated], i) => {
    const x = 452 + (i % 3) * 90, y = 92 + Math.floor(i / 3) * 44;
    b += `<rect x="${x}.5" y="${y}.5" width="80" height="36" rx="7" class="${gated ? 'gated' : 'box'}"/>` +
      txt(x + 10, y + 16, name, 'ink n b') + txt(x + 10, y + 29, role, `${gated ? 'hu' : 'mut'} r`);
  });

  // approval gate
  b += txt(752, 78, 'GATE', 'lbl');
  b += flow('M712.5 110.5H732.5V135.5H752', 'shu') + flow('M712.5 154.5H732.5V135.5', 'shu');
  b += `<rect x="752.5" y="92.5" width="96" height="86" rx="10" class="gatebox"/>`;
  b += `<circle cx="800" cy="118" r="10" fill="none" stroke="${t.hu}" stroke-width="1.6"/><path d="M797 114v8M803 114v8" stroke="${t.hu}" stroke-width="1.8" stroke-linecap="round"/>`;
  b += txt(800, 148, 'human', 'hu n b', 'text-anchor="middle"') + txt(800, 164, 'approval', 'hu n b', 'text-anchor="middle"');
  b += flow('M800.5 178.5V212', 'shu');
  b += `<rect x="752.5" y="212.5" width="96" height="52" rx="8" class="box"/>` +
    txt(800, 234, 'deploy', 'ink n', 'text-anchor="middle"') + txt(800, 251, 'send email', 'ink n', 'text-anchor="middle"');

  // event loop
  b += `<path d="M32 298.5H848" class="ln" stroke-dasharray="2 5"/>`;
  b += txt(32, 328, 'EVENT LOOP · 5 AGENTS ON SCHEDULES AND WEBHOOKS', 'lbl');
  b += `<rect x="32.5" y="342.5" width="140" height="46" rx="8" class="box"/>` + txt(46, 361, 'ARQ worker', 'ink n b') + txt(46, 377, 'redis queue', 'mut r');
  // the worker feeds each agent independently: one bus, five risers
  let ex = 200;
  const risers = [];
  EVENT_AGENTS.forEach(([name, trig]) => {
    const w = Math.ceil(Math.max(name.length * cw(11.5), trig.length * cw(10))) + 22;
    b += `<rect x="${ex}.5" y="342.5" width="${w}" height="46" rx="8" class="box"/>` + txt(ex + 11, 361, name, 'ink n') + txt(ex + 11, 377, trig, 'mut r');
    risers.push(Math.round(ex + w / 2) + 0.5);
    ex += w + 20;
  });
  b += flow(`M102.5 388.5V404.5H${risers.at(-1)}V388.5`);
  risers.slice(0, -1).forEach((x) => { b += flow(`M${x} 404.5V388.5`); });

  // memory
  b += txt(32, 448, 'MEMORY · 4 LAYERS', 'lbl');
  MEMORY.forEach(([name, store, scope], i) => {
    const x = 32 + i * 106;
    b += `<rect x="${x}.5" y="462.5" width="96" height="74" rx="8" class="box"/>` +
      txt(x + 10, 484, name, 'ink n b') + txt(x + 10, 503, store, 'ag r') + txt(x + 10, 521, scope, 'mut r');
  });

  // model routing
  b += txt(488, 448, 'MODEL ROUTING · PLUGGABLE BACKEND', 'lbl');
  b += `<rect x="488.5" y="462.5" width="360" height="74" rx="8" class="box"/>`;
  MODELS.forEach(([name, use], i) => {
    const y = 484 + i * 19;
    b += txt(502, y, name, 'ink n') + txt(834, y, use, 'mut r', 'text-anchor="end"');
  });

  return doc({
    w: W, h: H, t, css, body: b,
    title: 'CRUZ architecture',
    desc: 'Voice, web and Telegram input reach CruzAgent, which uses Claude native tool use as the router to twelve specialist agents. Deploys and emails pass a human approval gate. Five event-driven agents run from a Redis-backed worker. Memory has four layers: working, session, semantic and procedural. Models are routed between Claude Sonnet, local Qwen and Llama, and Gemini Flash.',
  });
}

// ── terminal trace ──────────────────────────────────────────────────────────
const TRACE = [
  { at: 0, kind: 'user', text: 'the client site is broken in prod' },
  { at: 8, kind: 'agent', who: 'sentinel', text: 'null check fails · orders.js:84' },
  { at: 16, kind: 'agent', who: 'forge', text: 'patched · 1 file changed' },
  { at: 24, kind: 'agent', who: 'qt', text: '12/12 tests passing' },
  { at: 34, kind: 'gate', text: 'approval required — deploy to prod?' },
  { at: 48, kind: 'user', text: 'yes' },
  { at: 56, kind: 'agent', who: 'titan', text: 'deployed · rollback armed' },
  { at: 64, kind: 'agent', who: 'echo', text: 'client update drafted for review' },
];

export function cruzTrace(t) {
  const W = 410, H = 300, DUR = 16;
  let css = `.l{font-size:12px;animation-duration:${DUR}s;animation-iteration-count:infinite;animation-timing-function:step-end}
.cur{animation:cur 1s step-end infinite}@keyframes cur{50%{opacity:0}}`;
  let b = panel(W, H, t) +
    `<path d="M1 46.5H${W - 1}" class="ln"/>` +
    [0, 1, 2].map((i) => `<circle cx="${30 + i * 16}" cy="24" r="4.5" fill="${t.line}"/>`).join('') +
    txt(W / 2, 28, 'cruz — session', 'fnt', 'font-size="11.5" text-anchor="middle"');
  TRACE.forEach((ln, i) => {
    const y = 78 + i * 26;
    // step-end: each line snaps in at its cue and the screen clears just before the loop restarts
    css += ln.at === 0 ? `@keyframes l${i}{0%{opacity:1}97%{opacity:0}100%{opacity:0}}` : `@keyframes l${i}{0%{opacity:0}${ln.at}%{opacity:1}97%{opacity:0}100%{opacity:0}}`;
    let row;
    if (ln.kind === 'user') row = `<tspan class="ag b">❯ </tspan><tspan class="ink b">${esc(ln.text)}</tspan>`;
    else if (ln.kind === 'gate') row = `<tspan class="hu b">Ⅱ ${esc(ln.text)}</tspan>`;
    else row = `<tspan class="ag">  ${esc(ln.who.padEnd(10))}</tspan><tspan class="mut">${esc(ln.text)}</tspan>`;
    const bg = ln.kind === 'gate' ? `<rect x="16.5" y="${y - 17}.5" width="${W - 33}" height="25" rx="6" fill="${t.huSoft}" stroke="${t.hu}" class="l" style="animation-name:l${i}"/>` : '';
    b += bg + `<text x="28" y="${y}" class="l" xml:space="preserve" style="animation-name:l${i}">${row}</text>`;
  });
  b += `<rect x="28" y="${78 + TRACE.length * 26 - 11}" width="7" height="13" fill="${t.ag}" class="cur"/>`;
  return doc({
    w: W, h: H, t, css, body: b,
    title: 'A CRUZ session',
    desc: 'User: the client site is broken in prod. Sentinel finds a failing null check, Forge patches it, QT reports 12 of 12 tests passing. CRUZ pauses for approval before deploying. After the user says yes, Titan deploys with rollback armed and Echo drafts a client update for review.',
  });
}

// ── by the numbers ──────────────────────────────────────────────────────────
const NUMBERS = [
  ['12', 'on-demand specialists', 'invoked in parallel'],
  ['5', 'event-driven agents', 'cron + webhooks'],
  ['1,200+', 'tests in the suite', 'agents · api · services'],
  ['4', 'memory layers', 'context to vectors'],
];

export function cruzNumbers(t) {
  const W = 410, H = 300;
  const css = `.big{font-size:40px;font-weight:800;letter-spacing:-1px}.c1{font-size:12px}.c2{font-size:11px}`;
  let b = panel(W, H, t, { fig: 'CRUZ · BY THE NUMBERS' });
  NUMBERS.forEach(([n, a, c], i) => {
    const x = 28 + (i % 2) * 184, y = 100 + Math.floor(i / 2) * 104;
    b += txt(x - 1, y, n, 's big ag') + txt(x, y + 24, a, 'ink c1') + txt(x, y + 41, c, 'mut c2');
  });
  b += `<path d="M28 254.5H${W - 28}" class="ln"/>` + txt(28, 277, 'Python · FastAPI · Postgres · Redis · Qdrant', 'mut', 'font-size="11.5"');
  return doc({
    w: W, h: H, t, css, body: b,
    title: 'CRUZ by the numbers',
    desc: '12 on-demand specialists, 5 event-driven agents, more than 1,200 tests, 4 memory layers. Built with Python, FastAPI, Postgres, Redis and Qdrant.',
  });
}
