import { hero } from './hero.mjs';
import { cruzArchitecture, cruzTrace, cruzNumbers } from './cruz.mjs';
import { cruzStack } from './cruz-stack.mjs';
import { afkChain } from './afk.mjs';
import { afkCard, mcpCard, dashCard } from './cards.mjs';
import { divider } from './divider.mjs';
import { stackAi, stackBackend, stackFrontend, stackInfra } from './stack.mjs';

// asset file name -> renderer(theme)
export const all = {
  hero,
  'cruz-stack': cruzStack,
  'cruz-architecture': cruzArchitecture,
  'cruz-trace': cruzTrace,
  'cruz-numbers': cruzNumbers,
  'afk-chain': afkChain,
  'afk-card': afkCard,
  'mcp-card': mcpCard,
  'dash-card': dashCard,
  divider,
  'stack-ai': stackAi,
  'stack-backend': stackBackend,
  'stack-frontend': stackFrontend,
  'stack-infra': stackInfra,
};
