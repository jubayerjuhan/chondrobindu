'use client';
import { useRef, useState } from 'react';
import { Reels } from '../../components/Reels';
import { PayoutTable } from '../../components/PayoutTable';
import { SYMBOLS } from '../../lib/slot';
import { useToast } from '../../components/ToastProvider';

const BETS = [10, 50, 100, 200];

export type SlotUser = {
  _id: string;
  email: string;
  name?: string;
  demoBalance: number;
  isSupporter: boolean;
  supporterTheme: string;
};

type Props = {
  user: SlotUser;
};

export default function SlotClient({ user: initialUser }: Props) {
  const { push } = useToast();
  const [user] = useState<SlotUser>(initialUser);
  const [balance, setBalance] = useState<number>(initialUser.demoBalance);
  const [bet, setBet] = useState<number>(BETS[0]);
  const [displayReels, setDisplayReels] = useState<string[]>(['🍋', '🍒', 'BAR']);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const randomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].key;

  const startRolling = () => {
    stopRolling();
    intervalRef.current = setInterval(() => {
      setDisplayReels([randomSymbol(), randomSymbol(), randomSymbol()]);
    }, 120);
  };

  const stopRolling = (finalReels?: string[]) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (finalReels) {
      finalReels.forEach((sym, idx) => {
        setTimeout(() => {
          setDisplayReels((prev) => {
            const next = [...prev];
            next[idx] = sym;
            return next;
          });
          if (idx === finalReels.length - 1) {
            setSpinning(false);
          }
        }, idx * 300);
      });
    } else {
      setSpinning(false);
    }
  };

  const spin = async () => {
    setWin(0);
    setMultiplier(0);
    setSpinning(true);
    const startedAt = Date.now();
    startRolling();
    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bet }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Spin failed');
      }
      setBalance(data.balance);
      setWin(data.win);
      setMultiplier(data.multiplier);
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, 2000 - elapsed); // minimum 2s spin time
      setTimeout(() => stopRolling(data.reels), remaining);
      if (data.win > 0) {
        push(`You won ${data.win} (x${data.multiplier})!`, 'success');
      }
    } catch (err: any) {
      push(err.message || 'Spin failed', 'error');
      stopRolling();
    }
  };

  const dailyRefill = async () => {
    const res = await fetch('/api/daily-refill', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setBalance(data.balance);
      push('Balance refilled to 10,000 demo credits', 'success');
    } else {
      push(data.error || 'Refill unavailable', 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 cabinet-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-400">Balance</div>
              <div className="text-2xl font-bold">{balance.toLocaleString()} credits</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Bet</div>
              <div className="flex gap-2 mt-2">
                {BETS.map((b) => (
                  <button
                    key={b}
                    className={`btn border ${
                      bet === b ? 'bg-cyan-500 text-slate-900 border-cyan-300' : 'bg-slate-800 border-slate-700'
                    }`}
                    onClick={() => setBet(b)}
                    disabled={spinning}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Reels reels={displayReels} spinning={spinning} win={win > 0} />

          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">RTP target 92% (demo)</div>
              <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">Server-driven</div>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn bg-slate-800 border border-slate-700" onClick={dailyRefill} disabled={spinning}>
                Daily refill
              </button>
              <button className="btn bg-emerald-400 text-slate-900 px-6 text-lg" onClick={spin} disabled={spinning}>
                {spinning ? 'Spinning...' : 'SPIN'}
              </button>
            </div>
          </div>

          {win > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 shadow-win">
              WIN +{win} (x{multiplier})
            </div>
          )}

          <p className="disclaimer">
            Demo cabinet only. Outcomes are managed for entertainment with RTP target controls. No deposits or
            withdrawals. Please play responsibly.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-2">Player</h3>
          <div className="space-y-1 text-sm text-slate-300">
            <div>{user.email}</div>
            <div className="text-slate-400">Supporter: {user.isSupporter ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <PayoutTable />
      </div>
    </div>
  );
}
