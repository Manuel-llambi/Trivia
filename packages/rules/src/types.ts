/**
 * Rules engine contracts.
 *
 * Pure data only: no I/O, no clock, no randomness. The server uses these types
 * for real payouts; the app uses them for previews. Every tunable value lives
 * in `RulesConfig` and is injected, never hardcoded in a rule.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Whole number of Pulsos. Rules never produce fractions. */
export type Pulsos = number;

/**
 * Multiplier expressed in hundredths (×1.3 → 130, factor 0.9 → 90).
 * Keeps payout math in integers so `floor` never trips on float error
 * (e.g. 0.9 × 6 × 5 = 27.000000000000004).
 */
export type Hundredths = number;

/** Competitor in a match. Today a user; later possibly a team. */
export type ParticipantId = string;

// ---------------------------------------------------------------------------
// Configuration (provisional values until the economy simulation runs)
// ---------------------------------------------------------------------------

export interface AtLeastTier {
  /** Minimum correct answers required (MVP: 4, 5, 6, 7). */
  readonly threshold: number;
  /** Total payout multiplier, stake included (MVP: 130, 200, 400, 800). */
  readonly multiplier: Hundredths;
}

export interface RulesConfig {
  /** MVP: 5. */
  readonly sessionsPerMatch: number;
  /** MVP: 7. */
  readonly questionsPerSession: number;
  /** Time shown to the player. MVP: 20 000 ms. */
  readonly visibleAnswerMs: number;
  /** Server acceptance limit, absorbs latency. MVP: 22 000 ms. */
  readonly acceptedAnswerMs: number;
  /** Pulsos moved from the general counter into the bag. MVP: 50. */
  readonly entryCost: Pulsos;
  /** MVP: 25. */
  readonly pulsosPerAura: Pulsos;
  /** Allowed "at least X" thresholds and their payouts. */
  readonly atLeastTiers: readonly AtLeastTier[];
  /** "Win the session" factor applied per standing player. MVP: 90. */
  readonly winSessionFactor: Hundredths;
  /** Minimum players who played the session; below it stakes are refunded. MVP: 2. */
  readonly winSessionMinPlayers: number;
  /** Paid to first place only if the match reaches the end of the last day. MVP: 150. */
  readonly grandPrize: Pulsos;
  /** Aura cutoffs that unlock emblems, ascending. MVP: [5, 10, 20, 50, 100]. */
  readonly emblemAuraThresholds: readonly number[];
}

// ---------------------------------------------------------------------------
// Bag
// ---------------------------------------------------------------------------

/**
 * A participant's bag inside one match.
 * Available = total - reserved. Invariant: 0 <= reserved <= total.
 */
export interface Bag {
  readonly total: Pulsos;
  /** Locked by topic stakes until they resolve. */
  readonly reserved: Pulsos;
}

// ---------------------------------------------------------------------------
// Moment 1: topic stakes
// ---------------------------------------------------------------------------

export interface AtLeastStake {
  readonly threshold: number;
  readonly stake: Pulsos;
}

/** Confirmed on "Jugar la sesión". Both are optional (0 / null = not placed). */
export interface TopicStakes {
  readonly winSession: Pulsos;
  readonly atLeast: AtLeastStake | null;
}

// ---------------------------------------------------------------------------
// Moment 2: questions
// ---------------------------------------------------------------------------

/** What the server recorded for one question. */
export type QuestionSubmission =
  | {
      readonly kind: 'answered';
      readonly correct: boolean;
      readonly stake: Pulsos;
      /** Server time from question delivery to answer reception. */
      readonly elapsedMs: number;
    }
  /** Timer ran out without "Responder", or the session window closed. */
  | { readonly kind: 'unanswered' };

/**
 * Classified result. `expired` covers both unanswered and late (> acceptedAnswerMs):
 * it counts as wrong and moves 0 Pulsos.
 *
 * For the "win the session" tiebreak (lower total time wins), an `expired`
 * question adds `visibleAnswerMs` (20 s); answered questions add `elapsedMs`.
 * Decision taken 2026-11-21; not specified in the MVP doc.
 */
export type QuestionOutcome = 'correct' | 'wrong' | 'expired';

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export interface SessionPlay {
  readonly participantId: ParticipantId;
  readonly topicStakes: TopicStakes;
  /** In delivery order. Missing trailing entries count as unanswered. */
  readonly submissions: readonly QuestionSubmission[];
}

export interface SessionContext {
  /** 1-based day number. */
  readonly day: number;
  /**
   * Participants not expelled, counted at the day's opening time
   * (quick mode: when the first participant starts the session).
   * Fixes the "win the session" multiplier for everyone that day.
   */
  readonly standingAtOpen: number;
}

// ---------------------------------------------------------------------------
// Ledger (every Pulsos movement is an entry; balances derive from them)
// ---------------------------------------------------------------------------

export type LedgerEntryKind =
  | 'match_entry' // general counter → bag
  | 'topic_reserve' // available → reserved (bag total unchanged)
  | 'topic_release' // reserved → available when a topic stake resolves
  | 'question_win'
  | 'question_loss'
  | 'at_least_win'
  | 'at_least_loss'
  | 'win_session_win'
  | 'win_session_loss'
  // Refund (fewer than winSessionMinPlayers played) = a `topic_release` with
  // no win/loss entry: the stake never left the bag total.
  | 'grand_prize'
  | 'bag_return'; // bag → general counter at match end

/** The two moment-1 stakes; they reserve and release independently. */
export type TopicMarket = 'at_least' | 'win_session';

export interface LedgerEntry {
  readonly participantId: ParticipantId;
  readonly kind: LedgerEntryKind;
  /**
   * Signed change. `topic_reserve` / `topic_release` move `bag.reserved`
   * (+ reserves, - releases); every other kind moves `bag.total`
   * (`match_entry` and `bag_return` move between bag and general counter).
   */
  readonly amount: Pulsos;
  /** Set on topic reserve, release and settlement entries. */
  readonly market?: TopicMarket;
}

// ---------------------------------------------------------------------------
// Match, ranking and end
// ---------------------------------------------------------------------------

export type ParticipantStatus = 'standing' | 'expelled';

export interface MatchParticipant {
  readonly id: ParticipantId;
  readonly bag: Bag;
  readonly status: ParticipantStatus;
  /** Accumulated across the match. Shown as data, never decides the winner. */
  readonly correctAnswers: number;
}

export interface Standing {
  readonly participantId: ParticipantId;
  /** Shared on ties, next rank skips (1, 2, 2, 4). */
  readonly rank: number;
  /** bag.total - entryCost. Decides the ranking. */
  readonly netPulsos: Pulsos;
}

export type MatchEndReason =
  | 'completed' // last day resolved → grand prize applies
  | 'last_standing'; // only one participant left → no grand prize

// ---------------------------------------------------------------------------
// Aura
// ---------------------------------------------------------------------------

export interface AuraState {
  /** floor(freePulsos / pulsosPerAura). */
  readonly aura: number;
  /** Progress toward the next aura, 0..pulsosPerAura-1. */
  readonly progress: Pulsos;
  /** Index into `emblemAuraThresholds`, or null below the first cutoff. */
  readonly emblemIndex: number | null;
}
