import { classifyQuestion } from './question.ts';
import { applyMultiplier, countCorrect } from './topic.ts';
import type {
  Hundredths,
  LedgerEntry,
  ParticipantId,
  Pulsos,
  QuestionSubmission,
  RulesConfig,
  SessionContext,
  SessionPlay,
} from './types.ts';

/** factor × standing players at opening (0.9 × 6 → 540). Same for everyone that day. */
export function winSessionMultiplier(standingAtOpen: number, config: RulesConfig): Hundredths {
  return config.winSessionFactor * standingAtOpen;
}

/** Total paid to the winner, stake included. Used for previews too. */
export function winSessionPayout(stake: Pulsos, standingAtOpen: number, config: RulesConfig): Pulsos {
  return applyMultiplier(stake, winSessionMultiplier(standingAtOpen, config));
}

/**
 * Tiebreak time. In-time answers add their server elapsed time; expired
 * (unanswered or late) and never-shown questions add `visibleAnswerMs`.
 */
export function sessionTotalTimeMs(
  submissions: readonly QuestionSubmission[],
  config: RulesConfig,
): number {
  const missing = Math.max(0, config.questionsPerSession - submissions.length);
  const answeredTime = submissions.reduce(
    (total, s) =>
      total +
      (s.kind === 'answered' && classifyQuestion(s, config) !== 'expired'
        ? s.elapsedMs
        : config.visibleAnswerMs),
    0,
  );
  return answeredTime + missing * config.visibleAnswerMs;
}

/**
 * Most correct answers among everyone who played (staked or not); ties broken
 * by lower total time. Players still tied on both all win and each is paid
 * in full (decided 2026-11-21; not defined in the MVP doc).
 */
export function winSessionWinners(
  plays: readonly SessionPlay[],
  config: RulesConfig,
): ParticipantId[] {
  const scored = plays.map((p) => ({
    id: p.participantId,
    correct: countCorrect(p.submissions, config),
    timeMs: sessionTotalTimeMs(p.submissions, config),
  }));
  const best = scored.reduce<(typeof scored)[number] | undefined>(
    (top, s) =>
      !top || s.correct > top.correct || (s.correct === top.correct && s.timeMs < top.timeMs)
        ? s
        : top,
    undefined,
  );
  if (!best) return [];
  return scored.filter((s) => s.correct === best.correct && s.timeMs === best.timeMs).map((s) => s.id);
}

/**
 * Resolves "win the session" once every standing player finished or the
 * window closed. Every stake is released; winners add the net gain, losers
 * lose the stake. Fewer than `winSessionMinPlayers` played → release only (refund).
 */
export function settleWinSession(
  plays: readonly SessionPlay[],
  context: SessionContext,
  config: RulesConfig,
): LedgerEntry[] {
  const refund = plays.length < config.winSessionMinPlayers;
  const winners = new Set(refund ? [] : winSessionWinners(plays, config));

  return plays.flatMap((p): LedgerEntry[] => {
    const stake = p.topicStakes.winSession;
    if (stake === 0) return [];
    const participantId = p.participantId;
    const release: LedgerEntry = { participantId, kind: 'topic_release', amount: -stake, market: 'win_session' };

    if (refund) return [release];
    if (!winners.has(participantId)) {
      return [release, { participantId, kind: 'win_session_loss', amount: -stake, market: 'win_session' }];
    }
    const gain = winSessionPayout(stake, context.standingAtOpen, config) - stake;
    return gain > 0
      ? [release, { participantId, kind: 'win_session_win', amount: gain, market: 'win_session' }]
      : [release];
  });
}
