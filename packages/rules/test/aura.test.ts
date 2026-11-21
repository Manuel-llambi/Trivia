import { describe, expect, it } from 'vitest';
import { auraState } from '../src/aura.ts';
import { mvpConfig } from './fixtures.ts';

describe('auraState', () => {
  it('is floor(free Pulsos / 25) with the progress toward the next one', () => {
    expect(auraState(50, mvpConfig)).toEqual({ aura: 2, progress: 0, emblemIndex: null });
    expect(auraState(41, mvpConfig)).toEqual({ aura: 1, progress: 16, emblemIndex: null });
  });

  it('is 0 with 0 free Pulsos', () => {
    expect(auraState(0, mvpConfig)).toEqual({ aura: 0, progress: 0, emblemIndex: null });
  });

  it('unlocks emblems at 5, 10, 20, 50 and 100 aura', () => {
    expect(auraState(124, mvpConfig).emblemIndex).toBeNull(); // 4 aura
    expect(auraState(125, mvpConfig).emblemIndex).toBe(0); // 5 aura
    expect(auraState(250, mvpConfig).emblemIndex).toBe(1); // 10 aura
    expect(auraState(2_500, mvpConfig).emblemIndex).toBe(4); // 100 aura
    expect(auraState(9_999, mvpConfig).emblemIndex).toBe(4);
  });

  it('drops aura and emblem when Pulsos go down', () => {
    expect(auraState(249, mvpConfig)).toEqual({ aura: 9, progress: 24, emblemIndex: 0 });
  });
});
