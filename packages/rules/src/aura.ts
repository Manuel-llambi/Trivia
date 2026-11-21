import type { AuraState, Pulsos, RulesConfig } from './types.ts';

/** Aura follows free Pulsos up and down; so does the emblem. */
export function auraState(freePulsos: Pulsos, config: RulesConfig): AuraState {
  const aura = Math.floor(freePulsos / config.pulsosPerAura);
  const progress = freePulsos % config.pulsosPerAura;
  const unlocked = config.emblemAuraThresholds.filter((t) => aura >= t).length;
  return { aura, progress, emblemIndex: unlocked > 0 ? unlocked - 1 : null };
}
