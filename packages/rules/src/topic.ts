import { availablePulsos, classifyQuestion } from './question.ts';
import type {
  AtLeastStake,
  Bag,
  Hundredths,
  LedgerEntry,
  ParticipantId,
  Pulsos,
  QuestionSubmission,
  RulesConfig,
  TopicStakes,
} from './types.ts';

const isWholeAmount = (n: Pulsos): boolean => Number.isInteger(n) && n >= 0;

/** Single rounding rule for every multiplied payout: floor, in integer math. */
export function applyMultiplier(stake: Pulsos, multiplier: Hundredths): Pulsos {
  return Math.floor((stake * multiplier) / 100);
}

function atLeastMultiplier(threshold: number, config: RulesConfig): Hundredths {
  const tier = config.atLeastTiers.find((t) => t.threshold === threshold);
  if (!tier) throw new Error(`No "at least" tier configured for threshold ${threshold}`);
  return tier.multiplier;
}

/** Upper bound for one topic card on its own (the sum is also bounded by the bag). */
export function maxTopicStake(bag: Bag, config: RulesConfig): Pulsos {
  const available = availablePulsos(bag);
  return config.topicStakeCap === null ? available : Math.min(available, config.topicStakeCap);
}

/**
 * Both stakes are optional, must be whole amounts within the per-card cap,
 * the threshold must be configured, and their sum must fit in the available Pulsos.
 */
export function isValidTopicStakes(stakes: TopicStakes, bag: Bag, config: RulesConfig): boolean {
  const atLeastStake = stakes.atLeast?.stake ?? 0;
  if (!isWholeAmount(stakes.winSession) || !isWholeAmount(atLeastStake)) return false;
  const cap = maxTopicStake(bag, config);
  if (stakes.winSession > cap || atLeastStake > cap) return false;
  if (stakes.atLeast && !config.atLeastTiers.some((t) => t.threshold === stakes.atLeast?.threshold)) {
    return false;
  }
  return stakes.winSession + atLeastStake <= availablePulsos(bag);
}

/** Entries written on "Jugar la sesión". Assumes stakes were validated. */
export function reserveTopicStakes(participantId: ParticipantId, stakes: TopicStakes): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  if (stakes.winSession > 0) {
    entries.push({ participantId, kind: 'topic_reserve', amount: stakes.winSession, market: 'win_session' });
  }
  if (stakes.atLeast && stakes.atLeast.stake > 0) {
    entries.push({ participantId, kind: 'topic_reserve', amount: stakes.atLeast.stake, market: 'at_least' });
  }
  return entries;
}

/** Total paid when the threshold is reached, stake included. Used for previews too. */
export function atLeastPayout(stake: Pulsos, threshold: number, config: RulesConfig): Pulsos {
  return applyMultiplier(stake, atLeastMultiplier(threshold, config));
}

/** Late and unanswered questions count as wrong. */
export function countCorrect(submissions: readonly QuestionSubmission[], config: RulesConfig): number {
  return submissions.filter((s) => classifyQuestion(s, config) === 'correct').length;
}

/**
 * Resolves "at least X" when the player finishes (or the window closes):
 * releases the reserve, then adds the net gain or removes the stake.
 */
export function settleAtLeast(
  participantId: ParticipantId,
  atLeast: AtLeastStake | null,
  correctCount: number,
  config: RulesConfig,
): LedgerEntry[] {
  if (!atLeast || atLeast.stake === 0) return [];
  const { stake, threshold } = atLeast;

  const entries: LedgerEntry[] = [
    { participantId, kind: 'topic_release', amount: -stake, market: 'at_least' },
  ];

  if (correctCount < threshold) {
    entries.push({ participantId, kind: 'at_least_loss', amount: -stake, market: 'at_least' });
    return entries;
  }

  const gain = atLeastPayout(stake, threshold, config) - stake;
  if (gain > 0) {
    entries.push({ participantId, kind: 'at_least_win', amount: gain, market: 'at_least' });
  }
  return entries;
}
