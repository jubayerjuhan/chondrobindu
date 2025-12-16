export type SymbolDef = {
  key: string;
  weight: number;
  payout3: number;
  payout2: number;
};

export const SYMBOLS: SymbolDef[] = [
  { key: '7', weight: 2, payout3: 50, payout2: 0 },
  { key: 'BAR', weight: 5, payout3: 20, payout2: 0 },
  { key: '💎', weight: 3, payout3: 30, payout2: 0 },
  { key: '🔔', weight: 7, payout3: 15, payout2: 0 },
  { key: '🍒', weight: 10, payout3: 10, payout2: 2 },
  { key: '🍋', weight: 12, payout3: 6, payout2: 1 },
];

const totalWeight = SYMBOLS.reduce((acc, s) => acc + s.weight, 0);

export function pickWeightedSymbol(symbols: SymbolDef[] = SYMBOLS): SymbolDef {
  const sum = symbols.reduce((acc, s) => acc + s.weight, 0);
  const roll = Math.random() * sum;
  let cursor = 0;
  for (const sym of symbols) {
    cursor += sym.weight;
    if (roll <= cursor) return sym;
  }
  return symbols[symbols.length - 1];
}

export function spinOnce(): SymbolDef[] {
  return [pickWeightedSymbol(), pickWeightedSymbol(), pickWeightedSymbol()];
}

export function calcPayout(result: SymbolDef[], bet: number) {
  const counts: Record<string, number> = {};
  for (const sym of result) counts[sym.key] = (counts[sym.key] || 0) + 1;

  let multiplier = 0;
  for (const sym of SYMBOLS) {
    if (counts[sym.key] === 3) {
      multiplier = sym.payout3;
      break;
    }
  }

  if (multiplier === 0) {
    for (const sym of SYMBOLS) {
      if (counts[sym.key] === 2) {
        multiplier = sym.payout2;
        if (multiplier > 0) break;
      }
    }
  }

  const win = bet * multiplier;
  return { multiplier, win };
}

// Demo-only RTP control. Resamples losing spins to approximate target RTP.
export const RTP_TARGET = 0.92;

export function serverSpinWithRTP(bet: number) {
  const trySpin = () => {
    const reels = spinOnce();
    const payout = calcPayout(reels, bet);
    return { reels, payout };
  };

  const shouldWin = Math.random() < RTP_TARGET * 0.25; // tune weight: fewer wins than RTP target.
  let attempt = 0;
  let outcome = trySpin();

  if (!shouldWin) {
    while (outcome.payout.multiplier > 0 && attempt < 12) {
      attempt += 1;
      outcome = trySpin();
    }
  }

  return outcome;
}
