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

/** Upper bound for a question stake: available Pulsos, limited by the cap if any. */
export function maxQuestionStake(bag: Bag, config: RulesConfig): Pulsos {
  const available = availablePulsos(bag);
  return config.questionStakeCap === null ? available : Math.min(available, config.questionStakeCap);
}

/**
 * A question stake must be a whole, non-negative amount up to the max stake,
 * so reserved + stake never exceeds the bag.
 */
export function isValidQuestionStake(stake: Pulsos, bag: Bag, config: RulesConfig): boolean {
  return Number.isInteger(stake) && stake >= 0 && stake <= maxQuestionStake(bag, config);
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
