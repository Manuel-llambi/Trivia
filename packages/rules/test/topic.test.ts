import { describe, expect, it } from 'vitest';
import {
  atLeastPayout,
  countCorrect,
  isValidTopicStakes,
  reserveTopicStakes,
  settleAtLeast,
} from '../src/topic.ts';
import type { QuestionSubmission } from '../src/types.ts';
import { mvpConfig, uncappedConfig } from './fixtures.ts';

const bag = { total: 62, reserved: 0 };

describe('isValidTopicStakes', () => {
  it('accepts placing nothing (confidence is optional)', () => {
    expect(isValidTopicStakes({ winSession: 0, atLeast: null }, bag, mvpConfig)).toBe(true);
  });

  it('accepts both stakes when their sum fits in the available Pulsos', () => {
    const stakes = { winSession: 30, atLeast: { threshold: 5, stake: 32 } };
    expect(isValidTopicStakes(stakes, bag, uncappedConfig)).toBe(true);
  });

  it('rejects stakes whose sum exceeds the available Pulsos', () => {
    const stakes = { winSession: 30, atLeast: { threshold: 5, stake: 33 } };
    expect(isValidTopicStakes(stakes, bag, uncappedConfig)).toBe(false);
  });

  it('only allows the configured thresholds (4 to 7)', () => {
    for (const threshold of [1, 2, 3, 8]) {
      const stakes = { winSession: 0, atLeast: { threshold, stake: 5 } };
      expect(isValidTopicStakes(stakes, bag, mvpConfig)).toBe(false);
    }
  });

  it('limits each card to the topic stake cap when configured', () => {
    const capped = { ...uncappedConfig, topicStakeCap: 10 };
    expect(isValidTopicStakes({ winSession: 10, atLeast: { threshold: 5, stake: 10 } }, bag, capped)).toBe(
      true,
    );
    expect(isValidTopicStakes({ winSession: 11, atLeast: null }, bag, capped)).toBe(false);
    expect(isValidTopicStakes({ winSession: 0, atLeast: { threshold: 5, stake: 11 } }, bag, capped)).toBe(
      false,
    );
  });

  it('rejects negative or fractional amounts', () => {
    expect(isValidTopicStakes({ winSession: -1, atLeast: null }, bag, mvpConfig)).toBe(false);
    expect(
      isValidTopicStakes({ winSession: 0, atLeast: { threshold: 4, stake: 1.5 } }, bag, mvpConfig),
    ).toBe(false);
  });
});

describe('reserveTopicStakes', () => {
  it('reserves each placed stake separately', () => {
    const stakes = { winSession: 5, atLeast: { threshold: 6, stake: 10 } };
    expect(reserveTopicStakes('p1', stakes)).toEqual([
      { participantId: 'p1', kind: 'topic_reserve', amount: 5, market: 'win_session' },
      { participantId: 'p1', kind: 'topic_reserve', amount: 10, market: 'at_least' },
    ]);
  });

  it('reserves nothing for stakes left at 0', () => {
    expect(reserveTopicStakes('p1', { winSession: 0, atLeast: { threshold: 4, stake: 0 } })).toEqual(
      [],
    );
  });
});

describe('atLeastPayout', () => {
  it('pays the MVP table with 10 Pulsos (stake included)', () => {
    expect(atLeastPayout(10, 4, mvpConfig)).toBe(13);
    expect(atLeastPayout(10, 5, mvpConfig)).toBe(20);
    expect(atLeastPayout(10, 6, mvpConfig)).toBe(40);
    expect(atLeastPayout(10, 7, mvpConfig)).toBe(80);
  });

  it('rounds down (5 × 1.3 = 6.5 → 6)', () => {
    expect(atLeastPayout(5, 4, mvpConfig)).toBe(6);
  });

  it('throws on a threshold that is not configured', () => {
    expect(() => atLeastPayout(5, 3, mvpConfig)).toThrow();
  });
});

describe('countCorrect', () => {
  it('counts only correct answers; late and unanswered count as wrong', () => {
    const submissions: QuestionSubmission[] = [
      { kind: 'answered', correct: true, stake: 0, elapsedMs: 5_000 },
      { kind: 'answered', correct: true, stake: 0, elapsedMs: 23_000 },
      { kind: 'answered', correct: false, stake: 0, elapsedMs: 5_000 },
      { kind: 'unanswered' },
    ];
    expect(countCorrect(submissions, mvpConfig)).toBe(1);
  });
});

describe('settleAtLeast', () => {
  it('releases the reserve and adds the gain when the threshold is reached', () => {
    expect(settleAtLeast('p1', { threshold: 6, stake: 5 }, 6, mvpConfig)).toEqual([
      { participantId: 'p1', kind: 'topic_release', amount: -5, market: 'at_least' },
      { participantId: 'p1', kind: 'at_least_win', amount: 15, market: 'at_least' },
    ]);
  });

  it('also pays when exceeding the threshold', () => {
    expect(settleAtLeast('p1', { threshold: 4, stake: 10 }, 7, mvpConfig)).toContainEqual({
      participantId: 'p1',
      kind: 'at_least_win',
      amount: 3,
      market: 'at_least',
    });
  });

  it('releases the reserve and loses the stake below the threshold', () => {
    expect(settleAtLeast('p1', { threshold: 5, stake: 10 }, 4, mvpConfig)).toEqual([
      { participantId: 'p1', kind: 'topic_release', amount: -10, market: 'at_least' },
      { participantId: 'p1', kind: 'at_least_loss', amount: -10, market: 'at_least' },
    ]);
  });

  it('only releases when the rounded payout equals the stake (no 0 gain entry)', () => {
    expect(settleAtLeast('p1', { threshold: 4, stake: 1 }, 4, mvpConfig)).toEqual([
      { participantId: 'p1', kind: 'topic_release', amount: -1, market: 'at_least' },
    ]);
  });

  it('moves nothing when no stake was placed', () => {
    expect(settleAtLeast('p1', null, 7, mvpConfig)).toEqual([]);
    expect(settleAtLeast('p1', { threshold: 4, stake: 0 }, 7, mvpConfig)).toEqual([]);
  });
});
