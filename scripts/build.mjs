// Renders every static figure in the README, once per GitHub theme.
//   node scripts/build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { themes } from './lib/theme.mjs';
import * as figures from './figures/index.mjs';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(out, { recursive: true });

for (const [name, render] of Object.entries(figures.all)) {
  for (const t of Object.values(themes)) {
    writeFileSync(join(out, `${name}-${t.name}.svg`), render(t));
  }
}
console.log(`built ${Object.keys(figures.all).length} figures x ${Object.keys(themes).length} themes -> assets/`);
