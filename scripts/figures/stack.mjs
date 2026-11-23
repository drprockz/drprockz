import { doc, panel, chipWrap } from '../lib/svg.mjs';

const GROUPS = {
  stackAi: ['STACK / AI + AGENTS', [
    ['Claude API', 'ag'], ['tool use', 'ag'], ['MCP', 'ag'], ['multi-agent orchestration', 'ag'], ['human-in-the-loop', 'hu'],
    'semantic memory', 'Qdrant', 'embeddings', 'Ollama', 'Gemini', 'faster-whisper', 'Claude Code plugins',
  ]],
  stackBackend: ['STACK / BACKEND + DATA', [
    'Python', 'FastAPI', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Redis', 'ARQ workers', 'GraphQL', 'SSE streaming', 'PHP',
  ]],
  stackFrontend: ['STACK / FRONTEND', [
    'React', 'Next.js', 'Tailwind CSS', 'PWA + offline', 'GSAP', 'Three.js', 'Framer Motion', 'Vue', 'Astro', 'WordPress',
  ]],
  stackInfra: ['STACK / INFRA + QUALITY', [
    'AWS', 'Docker', 'Nginx', 'GitHub Actions', 'Cloudflare Tunnel', 'PM2', 'Playwright', 'pytest', 'vitest', 'Lighthouse',
  ]],
};

const W = 410;
const wrap = (items, t) => chipWrap(items, t, { x: 28, y: 58, maxW: W - 54, fs: 11, h: 24, gap: 7, rowGap: 8 });
const sample = { line: '', ag: '', hu: '', stop: '', bg2: '', agSoft: '', huSoft: '' };
// Cards sit two to a row in the README, so each pair shares the taller height.
const PAIRS = [['stackAi', 'stackBackend'], ['stackFrontend', 'stackInfra']];
const heightOf = (key) => {
  const pair = PAIRS.find((p) => p.includes(key));
  return 58 + Math.max(...pair.map((k) => wrap(GROUPS[k][1], sample).height)) + 28;
};

const group = (key) => (t) => {
  const [label, items] = GROUPS[key];
  const H = heightOf(key);
  const body = panel(W, H, t, { fig: label }) + wrap(items, t).svg;
  return doc({ w: W, h: H, t, body, title: label, desc: items.map((i) => (Array.isArray(i) ? i[0] : i)).join(', ') });
};

export const stackAi = group('stackAi');
export const stackBackend = group('stackBackend');
export const stackFrontend = group('stackFrontend');
export const stackInfra = group('stackInfra');
