import { applyEntries, isExpelled, matchEndReason, rankStandings, settleMatchEnd } from '../src/match.ts';
import { availablePulsos, maxQuestionStake, settleQuestion } from '../src/question.ts';
import { countCorrect, isValidTopicStakes, reserveTopicStakes, settleAtLeast } from '../src/topic.ts';
import type {
  Bag,
  LedgerEntry,
  LedgerEntryKind,
  MatchEndReason,
  MatchParticipant,
  QuestionSubmission,
  RulesConfig,
  SessionPlay,
  TopicStakes,
} from '../src/types.ts';
import { settleWinSession } from '../src/win-session.ts';
import { amountFor, chooseTopicStakes, knownShare, type Profile } from './profiles.ts';
import { clamp, createRng, type Rng, uniform } from './random.ts';

export interface Scenario {
  readonly name: string;
  /** Topic difficulty shift per day, added to every player's accuracy. */
  readonly topicShift: readonly [min: number, max: number];
  /** Chance a player lets a question expire. */
  readonly expiryRate: number;
}

export const NORMAL: Scenario = { name: 'normal topics (60% avg)', topicShift: [-0.15, 0.15], expiryRate: 0.03 };
export const EASY: Scenario = { name: 'easy topics (80% avg)', topicShift: [0.05, 0.35], expiryRate: 0.03 };

interface PlayerState {
  readonly id: string;
  readonly profile: Profile;
  bag: Bag;
  correct: number;
}

const NO_STAKES: TopicStakes = { winSession: 0, atLeast: null };

export interface MatchResult {
  readonly reason: MatchEndReason;
  readonly ledger: readonly LedgerEntry[];
  /** Per player: net Pulsos at the end (final bag incl. prize - entry), win share, expelled. */
  readonly players: readonly { profile: string; net: number; winShare: number; expelled: boolean }[];
}

export function simulateMatch(table: readonly Profile[], scenario: Scenario, config: RulesConfig, rng: Rng): MatchResult {
  const ledger: LedgerEntry[] = [];
  const players: PlayerState[] = table.map((profile, i) => ({
    id: `p${i}`,
    profile,
    bag: { total: config.entryCost, reserved: 0 },
    correct: 0,
  }));

  const post = (p: PlayerState, entries: readonly LedgerEntry[]) => {
    ledger.push(...entries);
    p.bag = applyEntries(p.bag, p.id, entries);
  };
  const asParticipants = (): MatchParticipant[] =>
    players.map((p) => ({
      id: p.id,
      bag: p.bag,
      status: isExpelled(p.bag) ? 'expelled' : 'standing',
      correctAnswers: p.correct,
    }));

  let reason: MatchEndReason | null = null;
  for (let day = 1; day <= config.sessionsPerMatch && !reason; day++) {
    const shift = uniform(rng, ...scenario.topicShift);
    const standing = players.filter((p) => !isExpelled(p.bag));
    const plays: SessionPlay[] = [];

    for (const p of standing) {
      const accuracy = clamp(p.profile.accuracy + shift, 0.25, 0.98);
      const known = knownShare(accuracy);

      const wanted = chooseTopicStakes(p.profile, accuracy, p.bag, config);
      const stakes = isValidTopicStakes(wanted, p.bag, config) ? wanted : NO_STAKES;
      post(p, reserveTopicStakes(p.id, stakes));

      const submissions: QuestionSubmission[] = [];
      for (let q = 0; q < config.questionsPerSession && !isExpelled(p.bag); q++) {
        const knows = rng() < known;
        const correct = knows || rng() < 0.25;
        const risk = p.profile.betOnlyWhenKnown && !knows ? 0 : p.profile.questionStake;
        const stake = Math.min(amountFor(risk, availablePulsos(p.bag)), maxQuestionStake(p.bag, config));
        const submission: QuestionSubmission =
          rng() < scenario.expiryRate
            ? { kind: 'unanswered' }
            : { kind: 'answered', correct, stake, elapsedMs: Math.round(uniform(rng, 3_000, 18_000)) };
        submissions.push(submission);
        post(p, settleQuestion(p.id, submission, config));
      }

      const correctToday = countCorrect(submissions, config);
      p.correct += correctToday;
      post(p, settleAtLeast(p.id, stakes.atLeast, correctToday, config));
      plays.push({ participantId: p.id, topicStakes: stakes, submissions });
    }

    const winSessionEntries = settleWinSession(plays, { day, standingAtOpen: standing.length }, config);
    for (const p of standing) post(p, winSessionEntries.filter((e) => e.participantId === p.id));

    reason = matchEndReason(asParticipants(), day, config);
  }

  const finalReason = reason ?? 'completed';
  const participants = asParticipants();
  const firsts = rankStandings(participants, config).filter((s) => s.rank === 1).map((s) => s.participantId);
  const endEntries = settleMatchEnd(participants, finalReason, config);
  ledger.push(...endEntries);

  return {
    reason: finalReason,
    ledger,
    players: players.map((p) => {
      const returned = -(endEntries.find((e) => e.participantId === p.id && e.kind === 'bag_return')?.amount ?? 0);
      return {
        profile: p.profile.name,
        net: returned - config.entryCost,
        winShare: firsts.includes(p.id) ? 1 / firsts.length : 0,
        expelled: isExpelled(p.bag),
      };
    }),
  };
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

export interface ProfileStats {
  readonly profile: string;
  readonly avgNet: number;
  readonly winRate: number;
  readonly expulsionRate: number;
}

export interface SimulationReport {
  readonly matches: number;
  readonly profiles: readonly ProfileStats[];
  /** Average Pulsos created (+) or removed (-) per match, by source. */
  readonly createdPerMatch: Readonly<Record<'questions' | 'atLeast' | 'winSession' | 'grandPrize' | 'total', number>>;
  readonly completedRate: number;
}

const SOURCE: Partial<Record<LedgerEntryKind, keyof SimulationReport['createdPerMatch']>> = {
  question_win: 'questions',
  question_loss: 'questions',
  at_least_win: 'atLeast',
  at_least_loss: 'atLeast',
  win_session_win: 'winSession',
  win_session_loss: 'winSession',
  grand_prize: 'grandPrize',
};

export function simulate(
  table: readonly Profile[],
  scenario: Scenario,
  config: RulesConfig,
  matches: number,
  seed: number,
): SimulationReport {
  const rng = createRng(seed);
  const perProfile = new Map<string, { net: number; wins: number; expelled: number; n: number }>();
  const created = { questions: 0, atLeast: 0, winSession: 0, grandPrize: 0, total: 0 };
  let completed = 0;

  for (let m = 0; m < matches; m++) {
    const result = simulateMatch(table, scenario, config, rng);
    if (result.reason === 'completed') completed++;
    for (const e of result.ledger) {
      const source = SOURCE[e.kind];
      if (source) {
        created[source] += e.amount;
        created.total += e.amount;
      }
    }
    for (const p of result.players) {
      const s = perProfile.get(p.profile) ?? { net: 0, wins: 0, expelled: 0, n: 0 };
      s.net += p.net;
      s.wins += p.winShare;
      s.expelled += p.expelled ? 1 : 0;
      s.n++;
      perProfile.set(p.profile, s);
    }
  }

  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    matches,
    profiles: [...perProfile].map(([profile, s]) => ({
      profile,
      avgNet: round(s.net / s.n),
      winRate: round((100 * s.wins) / s.n),
      expulsionRate: round((100 * s.expelled) / s.n),
    })),
    createdPerMatch: {
      questions: round(created.questions / matches),
      atLeast: round(created.atLeast / matches),
      winSession: round(created.winSession / matches),
      grandPrize: round(created.grandPrize / matches),
      total: round(created.total / matches),
    },
    completedRate: round((100 * completed) / matches),
  };
}
