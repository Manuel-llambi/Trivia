import { describe, expect, it } from 'vitest';
import { MVP_CONFIG } from '../sim/mvp-config.ts';
import { DEFAULT_TABLE } from '../sim/profiles.ts';
import { NORMAL, simulate } from '../sim/simulate.ts';

describe('economy simulation (MVP config, normal topics)', () => {
  const report = simulate(DEFAULT_TABLE, NORMAL, MVP_CONFIG, 1_000, 7);
  const net = (profile: string) => report.profiles.find((p) => p.profile === profile)?.avgNet ?? Number.NaN;

  it('is reproducible with the same seed', () => {
    expect(simulate(DEFAULT_TABLE, NORMAL, MVP_CONFIG, 1_000, 7)).toEqual(report);
  });

  it('guessing loses: a 30% player who risks on everything ends below the entry', () => {
    expect(net('reckless-30')).toBeLessThan(0);
  });

  it('knowledge wins: the 90% player beats the 30% player with the same strategy', () => {
    expect(net('cautious-90')).toBeGreaterThan(net('cautious-30'));
    expect(net('reckless-90')).toBeGreaterThan(net('reckless-30'));
  });

  it('not risking moves no Pulsos', () => {
    expect(net('no-bet-60')).toBe(0);
  });
});
