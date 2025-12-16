import Link from 'next/link';

const themes = [
  { id: 'default', label: 'Default Glow', accent: 'cyan' },
  { id: 'ember', label: 'Ember Drift', accent: 'orange' },
  { id: 'lush', label: 'Lush Neon', accent: 'emerald' }
];

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold">Supporter Packs (Cosmetic Only)</h1>
        <p className="text-slate-300 mt-2 max-w-2xl">
          Grab a supporter pack to unlock cabinet themes and bragging rights. No gameplay advantages, no
          additional balance, no cash-out. Just vibes.
        </p>
        <p className="disclaimer">
          Cosmetic-only purchase. Does not add coins, spins, or any real-money value. For entertainment and
          appreciation of the project.
        </p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {themes.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="text-lg font-semibold">{t.label}</div>
              <div className="text-xs text-slate-400">Accent: {t.accent}</div>
            </div>
          ))}
        </div>
        <Link className="btn bg-cyan-500 text-slate-900 mt-6 inline-block" href="/profile">
          Manage Supporter Status
        </Link>
      </div>
    </div>
  );
}
