// Draws assets/activity-{dark,light}.svg from the GitHub contribution calendar.
//   GITHUB_TOKEN=... GH_LOGIN=drprockz node scripts/activity.mjs
//   node scripts/activity.mjs --sample        # deterministic fake data, for working on the design
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { themes } from './lib/theme.mjs';
import { activity } from './figures/activity.mjs';

const QUERY = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{
  totalContributions weeks{contributionDays{date contributionCount weekday}}}}}}`;

async function fetchCalendar(login, token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'profile-readme-activity' },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error(`no contribution calendar for "${login}": ${JSON.stringify(json.errors ?? json).slice(0, 300)}`);
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, weekday: d.weekday }))),
  };
}

function sampleCalendar() {
  let seed = 42;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const end = new Date(Date.UTC(2026, 10, 23));
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - 364 - end.getUTCDay());
  const weeks = []; let total = 0;
  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    if (d.getUTCDay() === 0) weeks.push([]);
    const busy = d.getUTCDay() % 6 === 0 ? 0.35 : 0.8;
    const count = rnd() < busy ? Math.floor(rnd() * rnd() * 18) : 0;
    total += count;
    weeks.at(-1).push({ date: d.toISOString().slice(0, 10), count, weekday: d.getUTCDay() });
  }
  return { total, weeks };
}

const sample = process.argv.includes('--sample');
const login = process.env.GH_LOGIN || 'drprockz';
const token = process.env.GITHUB_TOKEN;
if (!sample && !token) {
  console.error('GITHUB_TOKEN is not set (use --sample for fake data).');
  process.exit(1);
}

const data = sample ? sampleCalendar() : await fetchCalendar(login, token);
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(out, { recursive: true });
for (const t of Object.values(themes)) {
  writeFileSync(join(out, `activity${sample ? '-sample' : ''}-${t.name}.svg`), activity(t, data));
}
console.log(`${sample ? 'sample' : login}: ${data.total} contributions over ${data.weeks.length} weeks`);
