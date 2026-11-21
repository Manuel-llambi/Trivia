import { describe, expect, it } from 'vitest';
import {
  availablePulsos,
  classifyQuestion,
  isValidQuestionStake,
  maxQuestionStake,
  settleQuestion,
} from '../src/question.ts';
import { mvpConfig } from './fixtures.ts';

const answered = (correct: boolean, stake: number, elapsedMs = 8_000) =>
  ({ kind: 'answered', correct, stake, elapsedMs }) as const;

describe('classifyQuestion', () => {
  it('is correct when answered right within the accepted time', () => {
    expect(classifyQuestion(answered(true, 5), mvpConfig)).toBe('correct');
  });

  it('is wrong when answered wrong within the accepted time', () => {
    expect(classifyQuestion(answered(false, 5), mvpConfig)).toBe('wrong');
  });

  it('accepts answers arriving between 20 s and 22 s (latency margin)', () => {
    expect(classifyQuestion(answered(true, 5, 21_500), mvpConfig)).toBe('correct');
    expect(classifyQuestion(answered(true, 5, 22_000), mvpConfig)).toBe('correct');
  });

  it('is expired when the answer arrives after 22 s, even if it was right', () => {
    expect(classifyQuestion(answered(true, 5, 22_001), mvpConfig)).toBe('expired');
  });

  it('is expired when nothing was sent', () => {
    expect(classifyQuestion({ kind: 'unanswered' }, mvpConfig)).toBe('expired');
  });
});

describe('settleQuestion', () => {
  it('pays double the stake on a correct answer (net +stake)', () => {
    expect(settleQuestion('p1', answered(true, 5), mvpConfig)).toEqual([
      { participantId: 'p1', kind: 'question_win', amount: 5 },
    ]);
  });

  it('loses the stake on a wrong answer sent in time', () => {
    expect(settleQuestion('p1', answered(false, 5), mvpConfig)).toEqual([
      { participantId: 'p1', kind: 'question_loss', amount: -5 },
    ]);
  });

  it('moves nothing when the answer arrives late, whatever the stake', () => {
    expect(settleQuestion('p1', answered(false, 10, 23_000), mvpConfig)).toEqual([]);
  });

  it('moves nothing when unanswered', () => {
    expect(settleQuestion('p1', { kind: 'unanswered' }, mvpConfig)).toEqual([]);
  });

  it('moves nothing with a 0 stake, right or wrong', () => {
    expect(settleQuestion('p1', answered(true, 0), mvpConfig)).toEqual([]);
    expect(settleQuestion('p1', answered(false, 0), mvpConfig)).toEqual([]);
  });
});

describe('availablePulsos', () => {
  it('is the bag total minus what is reserved on the topic', () => {
    expect(availablePulsos({ total: 62, reserved: 5 })).toBe(57);
  });
});

describe('isValidQuestionStake', () => {
  const bag = { total: 62, reserved: 5 };

  it('accepts 0 and any whole amount up to the available Pulsos', () => {
    expect(isValidQuestionStake(0, bag, mvpConfig)).toBe(true);
    expect(isValidQuestionStake(57, bag, mvpConfig)).toBe(true);
  });

  it('rejects amounts above the available Pulsos (bag never goes negative)', () => {
    expect(isValidQuestionStake(58, bag, mvpConfig)).toBe(false);
  });

  it('only allows 0 when everything is reserved', () => {
    const fullyReserved = { total: 20, reserved: 20 };
    expect(isValidQuestionStake(0, fullyReserved, mvpConfig)).toBe(true);
    expect(isValidQuestionStake(1, fullyReserved, mvpConfig)).toBe(false);
  });

  it('rejects negative, fractional and non-finite amounts', () => {
    expect(isValidQuestionStake(-1, bag, mvpConfig)).toBe(false);
    expect(isValidQuestionStake(2.5, bag, mvpConfig)).toBe(false);
    expect(isValidQuestionStake(Number.NaN, bag, mvpConfig)).toBe(false);
    expect(isValidQuestionStake(Number.POSITIVE_INFINITY, bag, mvpConfig)).toBe(false);
  });
});

describe("question stake cap", () => {
  const capped = { ...mvpConfig, questionStakeCap: 10 };
  const bag = { total: 62, reserved: 5 };

  it("limits the max stake to the cap when the bag allows more", () => {
    expect(maxQuestionStake(bag, capped)).toBe(10);
    expect(isValidQuestionStake(10, bag, capped)).toBe(true);
    expect(isValidQuestionStake(11, bag, capped)).toBe(false);
  });

  it("still limits to the available Pulsos when they are below the cap", () => {
    expect(maxQuestionStake({ total: 8, reserved: 2 }, capped)).toBe(6);
  });

  it("has no cap when the config says null", () => {
    expect(maxQuestionStake(bag, mvpConfig)).toBe(57);
  });
});
