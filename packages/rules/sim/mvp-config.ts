import type { RulesConfig } from '../src/types.ts';

/**
 * MVP values (provisional until the simulation validates them). Used by the
 * simulation and the tests; production reads its config from the server.
 */
export const MVP_CONFIG: RulesConfig = {
  sessionsPerMatch: 5,
  questionsPerSession: 7,
  visibleAnswerMs: 20_000,
  acceptedAnswerMs: 22_000,
  entryCost: 50,
  pulsosPerAura: 25,
  atLeastTiers: [
    { threshold: 4, multiplier: 130 },
    { threshold: 5, multiplier: 200 },
    { threshold: 6, multiplier: 400 },
    { threshold: 7, multiplier: 800 },
  ],
  winSessionFactor: 90,
  winSessionMinPlayers: 2,
  grandPrize: 150,
  emblemAuraThresholds: [5, 10, 20, 50, 100],
};
