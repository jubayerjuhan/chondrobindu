import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserIdFromSession } from '../lib/auth';

export default async function Home() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    redirect('/auth/login?next=/');
  }

  return (
    <div className="space-y-8">
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 cabinet-glow">
        <h1 className="text-3xl font-bold mb-2">Chondrobindu Demo Cabinet</h1>
        <p className="text-slate-300 max-w-2xl">
          Spin the reels with play money, explore supporter cosmetics, and preview the cabinet feel. No
          withdrawals, no real-money wagering. Payouts and RTP tuning are for demo vibes only.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn bg-cyan-500 text-slate-900" href="/slot">
            Enter Cabinet
          </Link>
          <Link className="btn bg-slate-800 border border-slate-700" href="/support">
            Supporter Packs
          </Link>
          <Link className="btn bg-slate-800 border border-slate-700" href="/profile">
            Profile & History
          </Link>
        </div>
        <p className="disclaimer">
          Demo-only experience. No real currency deposits or withdrawals. RTP is simulated and intentionally
          managed for entertainment. Please play responsibly.
        </p>
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Spins are processed server-side with weighted symbols and a simple RTP guard that occasionally
            resamples to avoid wins. Balances are play-money demo balances. Supporter packs are cosmetic only.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Fairness note</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            For demo purposes, RTP is targeted at 92% using a basic resampling strategy. Not suitable for real
            gambling. Outcomes are not audited and should be treated as entertainment only.
          </p>
        </div>
      </section>
    </div>
  );
}
