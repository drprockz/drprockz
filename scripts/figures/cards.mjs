import { doc, panel, txt, chip, chipWrap } from '../lib/svg.mjs';

/** A 410px project card: label, status, title, two tagline lines, bullets, stack chips. */
function card(t, { h, label, status, tone = 'line', title, tag, bullets, stack, desc }) {
  const W = 410;
  const css = `.ti{font-size:27px;font-weight:800;letter-spacing:-.6px}.tg{font-size:12.5px}.bu{font-size:12px}`;
  let b = panel(W, h, t, { fig: label });
  b += chip(W - 26, 21, status, t, { tone, anchor: 'end', fs: 10.5, h: 22, padX: 9 }).svg;
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
  h: 372, label: 'CLAUDE CODE PLUGIN', status: 'open source · MIT', tone: 'ag', title: 'AFK',
  tag: ['The permission layer that lets Claude Code', 'keep working while you step away.'],
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
  h: 318, label: 'MCP SERVER', status: 'private', title: 'Shooterista MCP',
  tag: ['Lets Claude answer questions about a live,', 'multi-tenant club-management SaaS.'],
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
  h: 318, label: 'CLAUDE CODE MOD', status: 'public', tone: 'ag', title: 'session-dash',
  tag: ['A live cockpit for Claude Code sessions:', 'limits, context, cost and running agents.'],
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
