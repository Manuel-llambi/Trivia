import { availablePulsos } from '../src/question.ts';
import { atLeastPayout } from '../src/topic.ts';
import type { AtLeastStake, Bag, Pulsos, RulesConfig, TopicStakes } from '../src/types.ts';

/** How a simulated player risks Pulsos. Fractions apply to available Pulsos. */
export interface Profile {
  readonly name: string;
  /** Base probability of answering right on an average (60%) topic. */
  readonly accuracy: number;
  readonly questionStake: number;
  /** Calibrated players only risk on questions they actually know. */
  readonly betOnlyWhenKnown: boolean;
  /** `ev`: pick the X with best expected value, skip if negative. `fixed4`: always X = 4. */
  readonly atLeast: 'ev' | 'fixed4' | 'none';
  readonly topicStake: number;
  /** `confident`: only when its accuracy on today's topic is >= 75%. */
  readonly winSession: 'always' | 'confident' | 'never';
}

const OPTIONS = 4;

/** Share of questions truly known; the rest are guessed at 1/4. */
export const knownShare = (accuracy: number): number =>
  Math.max(0, (accuracy - 1 / OPTIONS) / (1 - 1 / OPTIONS));

export function amountFor(fraction: number, available: Pulsos): Pulsos {
  if (fraction <= 0 || available <= 0) return 0;
  return Math.min(available, Math.max(1, Math.floor(fraction * available)));
}

function binomialAtLeast(n: number, p: number, x: number): number {
  let total = 0;
  let coef = 1;
  for (let k = 0; k <= n; k++) {
    if (k > 0) coef = (coef * (n - k + 1)) / k;
    if (k >= x) total += coef * p ** k * (1 - p) ** (n - k);
  }
  return total;
}

function chooseThreshold(profile: Profile, accuracy: number, config: RulesConfig): number | null {
  if (profile.atLeast === 'none') return null;
  if (profile.atLeast === 'fixed4') return 4;
  let best: { threshold: number; ev: number } | null = null;
  for (const tier of config.atLeastTiers) {
    const ev = binomialAtLeast(config.questionsPerSession, accuracy, tier.threshold) * (tier.multiplier / 100) - 1;
    if (ev > 0 && (!best || ev > best.ev)) best = { threshold: tier.threshold, ev };
  }
  return best?.threshold ?? null;
}

export function chooseTopicStakes(
  profile: Profile,
  topicAccuracy: number,
  bag: Bag,
  config: RulesConfig,
): TopicStakes {
  const available = availablePulsos(bag);
  const cap = config.topicStakeCap ?? Number.POSITIVE_INFINITY;
  const wantsWinSession =
    profile.winSession === 'always' || (profile.winSession === 'confident' && topicAccuracy >= 0.75);
  const winSession = wantsWinSession ? Math.min(cap, amountFor(profile.topicStake, available)) : 0;

  const threshold = chooseThreshold(profile, topicAccuracy, config);
  let atLeast: AtLeastStake | null = null;
  if (threshold !== null) {
    const stake = Math.min(cap, amountFor(profile.topicStake, available - winSession));
    // Skip stakes that can never gain after rounding down (e.g. 1-3 Pulsos at ×1.3).
    const gains = atLeastPayout(stake, threshold, config) > stake;
    atLeast = stake > 0 && (gains || profile.atLeast === 'fixed4') ? { threshold, stake } : null;
  }
  return { winSession, atLeast };
}

const calibrated = (accuracy: number): Profile => ({
  name: `cautious-${accuracy * 100}`,
  accuracy,
  questionStake: 0.15,
  betOnlyWhenKnown: true,
  atLeast: 'ev',
  topicStake: 0.15,
  winSession: 'confident',
});

const reckless = (accuracy: number): Profile => ({
  name: `reckless-${accuracy * 100}`,
  accuracy,
  questionStake: 0.2,
  betOnlyWhenKnown: false,
  atLeast: 'fixed4',
  topicStake: 0.2,
  winSession: 'always',
});

const noBet = (accuracy: number): Profile => ({
  name: `no-bet-${accuracy * 100}`,
  accuracy,
  questionStake: 0,
  betOnlyWhenKnown: true,
  atLeast: 'none',
  topicStake: 0,
  winSession: 'never',
});

/** Default table: calibrated and reckless at 30/60/90%, plus a 60% player who never risks. */
export const DEFAULT_TABLE: readonly Profile[] = [
  calibrated(0.3),
  calibrated(0.6),
  calibrated(0.9),
  reckless(0.3),
  reckless(0.6),
  reckless(0.9),
  noBet(0.6),
];
