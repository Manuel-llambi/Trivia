import { describe, expect, it } from 'vitest';
import type { QuestionSubmission, SessionPlay } from '../src/types.ts';
import {
  sessionTotalTimeMs,
  settleWinSession,
  winSessionMultiplier,
  winSessionPayout,
  winSessionWinners,
} from '../src/win-session.ts';
import { mvpConfig } from './fixtures.ts';

const right = (elapsedMs: number, stake = 0): QuestionSubmission => ({
  kind: 'answered',
  correct: true,
  stake,
  elapsedMs,
});
const wrong = (elapsedMs: number, stake = 0): QuestionSubmission => ({
  kind: 'answered',
  correct: false,
  stake,
  elapsedMs,
});
const unanswered: QuestionSubmission = { kind: 'unanswered' };

/** 7 submissions: `correct` right answers then wrong ones, each taking `ms`. */
function play(participantId: string, correct: number, ms: number, winSession = 0): SessionPlay {
  const submissions = Array.from({ length: 7 }, (_, i) => (i < correct ? right(ms) : wrong(ms)));
  return { participantId, topicStakes: { winSession, atLeast: null }, submissions };
}

describe('winSessionMultiplier / winSessionPayout', () => {
  it('is 0.9 × standing players (MVP table)', () => {
    expect(winSessionMultiplier(2, mvpConfig)).toBe(180);
    expect(winSessionMultiplier(4, mvpConfig)).toBe(360);
    expect(winSessionMultiplier(6, mvpConfig)).toBe(540);
    expect(winSessionMultiplier(8, mvpConfig)).toBe(720);
  });

  it('pays the MVP table with 5 Pulsos, stake included', () => {
    expect(winSessionPayout(5, 2, mvpConfig)).toBe(9);
    expect(winSessionPayout(5, 4, mvpConfig)).toBe(18);
    expect(winSessionPayout(5, 6, mvpConfig)).toBe(27);
    expect(winSessionPayout(5, 8, mvpConfig)).toBe(36);
  });

  it('rounds down', () => {
    expect(winSessionPayout(3, 2, mvpConfig)).toBe(5); // 5.4 → 5
  });
});

describe('sessionTotalTimeMs', () => {
  it('adds server elapsed time for in-time answers', () => {
    const submissions = Array.from({ length: 7 }, () => right(3_000));
    expect(sessionTotalTimeMs(submissions, mvpConfig)).toBe(21_000);
  });

  it('adds the full 20 s for unanswered, late and missing questions', () => {
    const submissions = [right(3_000), unanswered, wrong(23_000), right(4_000)];
    // 3 + 20 + 20 + 4 + 3 missing × 20
    expect(sessionTotalTimeMs(submissions, mvpConfig)).toBe(107_000);
  });
});

describe('winSessionWinners', () => {
  it('picks whoever has the most correct answers', () => {
    const plays = [play('a', 5, 9_000), play('b', 6, 15_000), play('c', 4, 2_000)];
    expect(winSessionWinners(plays, mvpConfig)).toEqual(['b']);
  });

  it('breaks ties in correct answers by lower total time', () => {
    const plays = [play('a', 6, 9_000), play('b', 6, 8_000)];
    expect(winSessionWinners(plays, mvpConfig)).toEqual(['b']);
  });

  it('counts players who staked nothing', () => {
    const plays = [play('a', 3, 5_000, 10), play('b', 7, 5_000, 0)];
    expect(winSessionWinners(plays, mvpConfig)).toEqual(['b']);
  });

  it('returns every player tied on answers and time; all of them win', () => {
    const plays = [play('a', 6, 5_000), play('b', 6, 5_000), play('c', 2, 5_000)];
    expect(winSessionWinners(plays, mvpConfig)).toEqual(['a', 'b']);
  });
});

describe('settleWinSession', () => {
  const context = { day: 3, standingAtOpen: 6 };

  it('pays the winner and takes the stake from the losers', () => {
    const plays = [play('a', 6, 5_000, 5), play('b', 4, 5_000, 10)];
    expect(settleWinSession(plays, context, mvpConfig)).toEqual([
      { participantId: 'a', kind: 'topic_release', amount: -5, market: 'win_session' },
      { participantId: 'a', kind: 'win_session_win', amount: 22, market: 'win_session' },
      { participantId: 'b', kind: 'topic_release', amount: -10, market: 'win_session' },
      { participantId: 'b', kind: 'win_session_loss', amount: -10, market: 'win_session' },
    ]);
  });

  it('uses the multiplier fixed at opening, not who played', () => {
    const plays = [play('a', 6, 5_000, 5), play('b', 4, 5_000)];
    // 6 standing at open even though only 2 played → ×5.4
    expect(settleWinSession(plays, context, mvpConfig)).toContainEqual({
      participantId: 'a',
      kind: 'win_session_win',
      amount: 22,
      market: 'win_session',
    });
  });

  it('moves nothing for players who staked 0, winner or not', () => {
    const plays = [play('a', 7, 5_000), play('b', 1, 5_000)];
    expect(settleWinSession(plays, context, mvpConfig)).toEqual([]);
  });

  it('refunds (release only) when fewer than 2 played', () => {
    const plays = [play('a', 7, 5_000, 8)];
    expect(settleWinSession(plays, context, mvpConfig)).toEqual([
      { participantId: 'a', kind: 'topic_release', amount: -8, market: 'win_session' },
    ]);
  });
});
