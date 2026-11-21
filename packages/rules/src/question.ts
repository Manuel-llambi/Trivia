import type {
  Bag,
  LedgerEntry,
  ParticipantId,
  Pulsos,
  QuestionOutcome,
  QuestionSubmission,
  RulesConfig,
} from './types.ts';

/** Pulsos the player can still risk: bag total minus topic reservations. */
export function availablePulsos(bag: Bag): Pulsos {
  return bag.total - bag.reserved;
}

/**
 * A question stake must be a whole, non-negative amount that fits in the
 * available Pulsos, so reserved + stake never exceeds the bag.
 */
export function isValidQuestionStake(stake: Pulsos, bag: Bag): boolean {
  return Number.isInteger(stake) && stake >= 0 && stake <= availablePulsos(bag);
}

/**
 * Unanswered or received after `acceptedAnswerMs` is `expired`:
 * it counts as wrong, but the stake never reached the server in time.
 */
export function classifyQuestion(
  submission: QuestionSubmission,
  config: RulesConfig,
): QuestionOutcome {
  if (submission.kind === 'unanswered') return 'expired';
  if (submission.elapsedMs > config.acceptedAnswerMs) return 'expired';
  return submission.correct ? 'correct' : 'wrong';
}

/**
 * Ledger entries for one question. Correct pays double the stake (net +stake),
 * wrong loses the stake, expired or a 0 stake moves nothing.
 */
export function settleQuestion(
  participantId: ParticipantId,
  submission: QuestionSubmission,
  config: RulesConfig,
): LedgerEntry[] {
  const outcome = classifyQuestion(submission, config);
  if (outcome === 'expired' || submission.kind === 'unanswered') return [];
  if (submission.stake === 0) return [];

  return outcome === 'correct'
    ? [{ participantId, kind: 'question_win', amount: submission.stake }]
    : [{ participantId, kind: 'question_loss', amount: -submission.stake }];
}
