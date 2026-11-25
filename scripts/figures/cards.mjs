import { doc, panel, txt, chip, chipWrap } from '../lib/svg.mjs';
import { projector, box } from '../lib/iso.mjs';

// One small isometric object per card, in the corner under the status chip.
// Parts sit along the world diagonal, which is the horizontal on screen.
const P = projector({ ox: 346, oy: 66, s: 14 });
const shadow = (t) => `<ellipse cx="346" cy="98" rx="34" ry="6" fill="${t.line}" opacity=".7"/>`;
const GLYPH = {
  // a pause symbol in 3D: what AFK does to anything risky
  pause: (t) => shadow(t) + box(P, 2.3, 0.5, 0, 1.1, 1.1, 3, t.iso.hu) + box(P, 0.5, 2.3, 0, 1.1, 1.1, 3, t.iso.hu),
  // two endpoints and the wire between them
  link: (t) => {
    const a = P(3.25, 0.75, 0.75), b = P(0.75, 3.25, 0.75);
    return shadow(t) + `<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="${t.ag}" stroke-width="2.4" class="flow" stroke-dasharray="3 4"/>` +
      box(P, 2.7, 0, 0, 1.5, 1.5, 1.5, t.iso.dim, { stroke: t.line }) + box(P, 0, 2.7, 0, 1.5, 1.5, 1.5, t.iso.ag);
  },
  // a rising bar chart
  bars: (t) => shadow(t) + [0.8, 1.4, 2.1, 2.9].map((h, k) =>
    box(P, 0.2 + k * 0.95, 3.05 - k * 0.95, 0, 0.8, 0.8, h, k === 3 ? t.iso.ag : t.iso.dim, { stroke: k === 3 ? '' : t.line })).join(''),
};

/** A 410px project card: label, status, title, two tagline lines, bullets, stack chips. */
function card(t, { h, label, status, tone = 'line', title, tag, bullets, stack, desc, glyph }) {
  const W = 410;
  const css = `.ti{font-size:27px;font-weight:800;letter-spacing:-.6px}.tg{font-size:12.5px}.bu{font-size:12px}`;
  let b = panel(W, h, t, { fig: label });
  b += chip(W - 26, 21, status, t, { tone, anchor: 'end', fs: 10.5, h: 22, padX: 9 }).svg;
  if (glyph) b += GLYPH[glyph](t);
  b += txt(27, 84, title, 's ti ink');
  tag.forEach((s, i) => { b += txt(28, 110 + i * 18, s, 'mut tg'); });
  let y = 164;
  bullets.forEach((s) => {
    b += `<path d="M30 ${y - 4}h7" stroke="${t.ag}" stroke-width="1.6" stroke-linecap="round"/>` + txt(46, y, s, 'ink bu');
    y += 22;
  });
  b += chipWrap(stack, t, { x: 28, y: h - 46, maxW: W - 56, fs: 10.5 }).svg;
  return doc({ w: W, h, t, css, body: b, title, desc });
}

export const afkCard = (t) => card(t, {
  h: 372, label: 'CLAUDE CODE PLUGIN', glyph: 'pause', status: 'open source · MIT', tone: 'ag', title: 'AFK',
  tag: ['The permission layer that lets', 'Claude Code keep working while you’re away.'],
  bullets: [
    'learns your approve / deny patterns',
    'safe actions auto-approved and logged',
    'destructive ones wait in a review queue',
    'git checkpoint before anything risky',
    'approve from your phone: ntfy, Telegram',
    'local dashboard: history, rules, queue',
  ],
  stack: ['Node.js', 'SQLite', 'Claude Code hooks', 'Express'],
  desc: 'AFK: the permission layer that lets Claude Code keep working while you step away. Learns your approve and deny patterns, auto-approves safe actions, queues destructive ones for review, takes a git checkpoint before anything risky, lets you approve from your phone, and has a local dashboard. Open source, MIT.',
});

export const mcpCard = (t) => card(t, {
  h: 318, label: 'MCP SERVER', glyph: 'link', status: 'private', title: 'Shooterista MCP',
  tag: ['Lets Claude answer questions about', 'a live, multi-tenant club-management SaaS.'],
  bullets: [
    '32 typed, read-only tools over GraphQL',
    'local stdio + hosted HTTP connector',
    'OAuth with DCR + PKCE, per-user login',
    'personal data is never requested',
    'paced, cached, deadline-bound calls',
  ],
  stack: ['TypeScript', 'MCP SDK', 'zod', 'Docker'],
  desc: 'Shooterista MCP: a read-only MCP server that lets Claude answer questions about a live multi-tenant club-management SaaS. 32 typed tools over GraphQL, local stdio and hosted HTTP modes, OAuth with dynamic client registration and PKCE, no personal data requested, paced and cached calls. Private repository.',
});

export const dashCard = (t) => card(t, {
  h: 318, label: 'CLAUDE CODE MOD', glyph: 'bars', status: 'public', tone: 'ag', title: 'session-dash',
  tag: ['A live cockpit for Claude Code:', 'limits, context, cost and running agents.'],
  bullets: [
    'sidebar: 5-hour / 7-day limits with pace',
    'context breakdown, live agents, workflows',
    'status line with session + month cost',
    'all-time usage by model, project, tool',
    'macOS · Linux · Windows (Git Bash)',
  ],
  stack: ['TypeScript', 'bash + awk', 'Python'],
  desc: 'session-dash: a Claude Code mod that adds a live sidebar and status line showing usage limits with pace, context breakdown, running agents and workflows, session and month cost, and all-time usage by model, project and tool. Works on macOS, Linux and Windows.',
});
