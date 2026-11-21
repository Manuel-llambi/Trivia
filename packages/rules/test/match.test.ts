import { describe, expect, it } from 'vitest';
import {
  applyEntries,
  isExpelled,
  matchEndReason,
  rankStandings,
  settleMatchEnd,
} from '../src/match.ts';
import type { LedgerEntry, MatchParticipant } from '../src/types.ts';
import { mvpConfig } from './fixtures.ts';

const participant = (id: string, total: number): MatchParticipant => ({
  id,
  bag: { total, reserved: 0 },
  status: total === 0 ? 'expelled' : 'standing',
  correctAnswers: 0,
});

describe('applyEntries', () => {
  it('reserve and release move reserved; everything else moves the total', () => {
    const entries: LedgerEntry[] = [
      { participantId: 'p1', kind: 'topic_reserve', amount: 10, market: 'at_least' },
      { participantId: 'p1', kind: 'question_loss', amount: -5 },
      { participantId: 'p1', kind: 'topic_release', amount: -10, market: 'at_least' },
      { participantId: 'p1', kind: 'at_least_win', amount: 10, market: 'at_least' },
    ];
    expect(applyEntries({ total: 50, reserved: 0 }, 'p1', entries)).toEqual({ total: 55, reserved: 0 });
  });

  it('ignores entries of other participants', () => {
    const entries: LedgerEntry[] = [{ participantId: 'p2', kind: 'question_win', amount: 5 }];
    expect(applyEntries({ total: 50, reserved: 0 }, 'p1', entries)).toEqual({ total: 50, reserved: 0 });
  });
});

describe('isExpelled', () => {
  it('is expelled only when the bag total reaches 0', () => {
    expect(isExpelled({ total: 0, reserved: 0 })).toBe(true);
  });

  it('is not expelled with 0 available but Pulsos still reserved on the topic', () => {
    expect(isExpelled({ total: 20, reserved: 20 })).toBe(false);
  });
});

describe('rankStandings', () => {
  it('ranks by net Pulsos (bag - entry cost), highest first', () => {
    const standings = rankStandings([participant('a', 40), participant('b', 70)], mvpConfig);
    expect(standings).toEqual([
      { participantId: 'b', rank: 1, netPulsos: 20 },
      { participantId: 'a', rank: 2, netPulsos: -10 },
    ]);
  });

  it('shares the rank on ties and skips the next one (1, 2, 2, 4)', () => {
    const standings = rankStandings(
      [participant('a', 80), participant('b', 60), participant('c', 60), participant('d', 0)],
      mvpConfig,
    );
    expect(standings.map((s) => [s.participantId, s.rank])).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 2],
      ['d', 4],
    ]);
  });

  it('keeps expelled players in the ranking with their frozen result', () => {
    const standings = rankStandings([participant('a', 0), participant('b', 50)], mvpConfig);
    expect(standings).toContainEqual({ participantId: 'a', rank: 2, netPulsos: -50 });
  });
});

describe('matchEndReason', () => {
  it('is still running with 2+ standing before the last day resolves', () => {
    expect(matchEndReason([participant('a', 50), participant('b', 50)], 3, mvpConfig)).toBeNull();
  });

  it('completes when the last day resolves with 2+ standing', () => {
    expect(matchEndReason([participant('a', 50), participant('b', 50)], 5, mvpConfig)).toBe('completed');
  });

  it('ends as last standing when only one is left, at any day', () => {
    expect(matchEndReason([participant('a', 50), participant('b', 0)], 2, mvpConfig)).toBe('last_standing');
  });

  it('is last standing (no prize) even if it happens when day 5 resolves', () => {
    expect(matchEndReason([participant('a', 50), participant('b', 0)], 5, mvpConfig)).toBe('last_standing');
  });

  it('is last standing (no prize) when nobody is left standing', () => {
    expect(matchEndReason([participant('a', 0), participant('b', 0)], 4, mvpConfig)).toBe('last_standing');
  });
});

describe('settleMatchEnd', () => {
  it('pays the grand prize to first place when the match completes, then returns every bag', () => {
    const entries = settleMatchEnd([participant('a', 80), participant('b', 30)], 'completed', mvpConfig);
    expect(entries).toEqual([
      { participantId: 'a', kind: 'grand_prize', amount: 150 },
      { participantId: 'a', kind: 'bag_return', amount: -230 },
      { participantId: 'b', kind: 'bag_return', amount: -30 },
    ]);
  });

  it('splits the grand prize among tied first places, rounding down', () => {
    const entries = settleMatchEnd(
      [participant('a', 70), participant('b', 70), participant('c', 70), participant('d', 70)],
      'completed',
      mvpConfig,
    );
    const prizes = entries.filter((e) => e.kind === 'grand_prize');
    expect(prizes).toHaveLength(4);
    expect(prizes.every((e) => e.amount === 37)).toBe(true); // 150 / 4 = 37.5 → 37
  });

  it('pays no grand prize to the last player standing', () => {
    const entries = settleMatchEnd([participant('a', 95), participant('b', 0)], 'last_standing', mvpConfig);
    expect(entries).toEqual([{ participantId: 'a', kind: 'bag_return', amount: -95 }]);
  });

  it('returns nothing for an expelled player (bag already at 0)', () => {
    const entries = settleMatchEnd([participant('a', 60), participant('b', 0)], 'completed', mvpConfig);
    expect(entries.some((e) => e.participantId === 'b')).toBe(false);
  });
});
