import { SYMBOLS } from '../lib/slot';

export function PayoutTable() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Payout Table</h3>
        <div className="text-xs text-slate-400">3-kind / 2-kind</div>
      </div>
      <div className="space-y-2">
        {SYMBOLS.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between text-sm bg-slate-800/40 border border-slate-800 rounded-lg px-3 py-2"
          >
            <div className="font-semibold">{s.key}</div>
            <div className="text-slate-300">
              x{s.payout3} <span className="text-slate-500 mx-1">/</span> x{s.payout2}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
