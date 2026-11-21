/**
 * Economy simulation CLI: `npm run simulate -- [matches] [seed]`.
 * To try alternative values, edit a copy of MVP_CONFIG here.
 */
import { MVP_CONFIG } from './mvp-config.ts';
import { DEFAULT_TABLE } from './profiles.ts';
import { EASY, NORMAL, simulate } from './simulate.ts';

const matches = Number(process.argv[2] ?? 10_000);
const seed = Number(process.argv[3] ?? 42);

for (const scenario of [NORMAL, EASY]) {
  const report = simulate(DEFAULT_TABLE, scenario, MVP_CONFIG, matches, seed);
  console.log(`\n=== ${scenario.name} · ${matches} matches · seed ${seed} ===`);
  console.table(report.profiles);
  console.log('Pulsos created per match by source:', report.createdPerMatch);
  console.log(`Matches reaching the end of day 5: ${report.completedRate}%`);
}
