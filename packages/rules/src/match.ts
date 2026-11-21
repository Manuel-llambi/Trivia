import type {
  Bag,
  LedgerEntry,
  MatchEndReason,
  MatchParticipant,
  ParticipantId,
  RulesConfig,
  Standing,
} from './types.ts';

const MOVES_RESERVED = new Set<LedgerEntry['kind']>(['topic_reserve', 'topic_release']);

/** Derives a participant's bag from ledger entries (reserve/release move `reserved`). */
export function applyEntries(bag: Bag, participantId: ParticipantId, entries: readonly LedgerEntry[]): Bag {
  return entries
    .filter((e) => e.participantId === participantId)
    .reduce<Bag>(
      (b, e) =>
        MOVES_RESERVED.has(e.kind)
          ? { total: b.total, reserved: b.reserved + e.amount }
          : { total: b.total + e.amount, reserved: b.reserved },
      bag,
    );
}

/**
 * Evaluated on the bag total once reservations resolved: 0 available with
 * Pulsos still reserved is not an expulsion.
 */
export function isExpelled(bag: Bag): boolean {
  return bag.total === 0;
}

/**
 * Null while the match runs. One or zero standing ends it as `last_standing`
 * (no grand prize), even when it happens as the last day resolves, so players
 * cannot farm the prize by getting expelled on purpose. Otherwise it
 * completes once the last day resolved. Decided 2026-11-21.
 */
export function matchEndReason(
  participants: readonly MatchParticipant[],
  resolvedDays: number,
  config: RulesConfig,
): MatchEndReason | null {
  const standing = participants.filter((p) => !isExpelled(p.bag)).length;
  if (standing <= 1) return 'last_standing';
  return resolvedDays >= config.sessionsPerMatch ? 'completed' : null;
}

/** By net Pulsos (bag - entry cost). Ties share the rank and the next one skips. */
export function rankStandings(participants: readonly MatchParticipant[], config: RulesConfig): Standing[] {
  const sorted = participants
    .map((p) => ({ participantId: p.id, netPulsos: p.bag.total - config.entryCost }))
    .sort((a, b) => b.netPulsos - a.netPulsos);

  return sorted.map((s) => ({
    ...s,
    rank: 1 + sorted.filter((other) => other.netPulsos > s.netPulsos).length,
  }));
}

/**
 * Final entries: grand prize (only when the match completed, split among
 * tied first places, rounded down), then every bag returns to the general counter.
 */
export function settleMatchEnd(
  participants: readonly MatchParticipant[],
  reason: MatchEndReason,
  config: RulesConfig,
): LedgerEntry[] {
  const winners =
    reason === 'completed'
      ? new Set(rankStandings(participants, config).filter((s) => s.rank === 1).map((s) => s.participantId))
      : new Set<ParticipantId>();
  const prizeShare = winners.size > 0 ? Math.floor(config.grandPrize / winners.size) : 0;

  return participants.flatMap((p): LedgerEntry[] => {
    const prize = winners.has(p.id) ? prizeShare : 0;
    const entries: LedgerEntry[] = [];
    if (prize > 0) entries.push({ participantId: p.id, kind: 'grand_prize', amount: prize });
    const finalBag = p.bag.total + prize;
    if (finalBag > 0) entries.push({ participantId: p.id, kind: 'bag_return', amount: -finalBag });
    return entries;
  });
}
