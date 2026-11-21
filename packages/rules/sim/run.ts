/**
 * Economy simulation CLI: `npm run simulate -- [matches] [seed]`.
 * Compares the MVP config against variants; add variants to try other values.
 */
import type { RulesConfig } from '../src/types.ts';
import { MVP_CONFIG } from './mvp-config.ts';
import { DEFAULT_TABLE } from './profiles.ts';
import { EASY, NORMAL, simulate } from './simulate.ts';

const matches = Number(process.argv[2] ?? 10_000);
const seed = Number(process.argv[3] ?? 42);

const VARIANTS: readonly { name: string; config: RulesConfig }[] = [
  { name: 'MVP (no cap)', config: MVP_CONFIG },
  { name: 'cap 20', config: { ...MVP_CONFIG, questionStakeCap: 20 } },
  { name: 'cap 10', config: { ...MVP_CONFIG, questionStakeCap: 10 } },
];

for (const scenario of [NORMAL, EASY]) {
  console.log(`\n=== ${scenario.name} · ${matches} matches · seed ${seed} ===`);
  const reports = VARIANTS.map((v) => ({ name: v.name, report: simulate(DEFAULT_TABLE, scenario, v.config, matches, seed) }));

  const rows: Record<string, Record<string, string>> = {};
  for (const { name, report } of reports) {
    for (const p of report.profiles) {
      rows[p.profile] ??= {};
      rows[p.profile]![name] = `${p.avgNet} | win ${p.winRate}% | out ${p.expulsionRate}%`;
    }
  }
  console.log('Avg net Pulsos per match | win rate | expulsion rate');
  console.table(rows);
  console.log('Pulsos created per match by source:');
  console.table(Object.fromEntries(reports.map((r) => [r.name, r.report.createdPerMatch])));
}
