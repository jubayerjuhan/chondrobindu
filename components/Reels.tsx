'use client';
import { SYMBOLS } from '../lib/slot';

type Props = {
  reels: string[];
  spinning: boolean;
  win: boolean;
};

export function Reels({ reels, spinning, win }: Props) {
  const display = reels.length === 3 ? reels : SYMBOLS.slice(0, 3).map((s) => s.key);
  const loopSymbols = [...SYMBOLS.map((s) => s.key), ...SYMBOLS.map((s) => s.key)];
  return (
    <div className="grid grid-cols-3 gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 cabinet-glow">
      {display.map((sym, idx) => (
        <div
          key={`${sym}-${idx}`}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 ${
            win ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'border-slate-700/60'
          }`}
          style={{ height: '160px' }}
        >
          <div
            className={`reel-track ${spinning ? 'reel-track-spin' : ''}`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {spinning
              ? loopSymbols.map((s, i) => (
                  <div key={`${idx}-${i}`} className="reel-cell">
                    {s}
                  </div>
                ))
              : (
                  <div className="reel-cell reel-cell-final">{sym}</div>
                )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent mix-blend-overlay rounded-xl" />
          <div className="pointer-events-none absolute inset-0 border-2 border-white/5 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
