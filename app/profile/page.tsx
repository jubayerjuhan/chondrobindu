'use client';
import { useEffect, useState } from 'react';
import { useToast } from '../../components/ToastProvider';

const themes = [
  { id: 'default', label: 'Default Glow' },
  { id: 'ember', label: 'Ember Drift' },
  { id: 'lush', label: 'Lush Neon' },
];

type Spin = {
  _id: string;
  bet: number;
  result: string;
  multiplier: number;
  win: number;
  createdAt: string;
};

type User = {
  email: string;
  isSupporter: boolean;
  supporterTheme: string;
};

export default function ProfilePage() {
  const { push } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [spins, setSpins] = useState<Spin[]>([]);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        if (data.spins) setSpins(data.spins);
      })
      .catch(() => push('Failed to load profile', 'error'));
  }, [push]);

  const updateTheme = async (theme: string) => {
    const res = await fetch('/api/profile/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser((u) => (u ? { ...u, supporterTheme: data.supporterTheme } : u));
      push('Theme updated', 'success');
    } else {
      push(data.error || 'Unable to update theme', 'error');
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setSpins([]);
    push('Logged out', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        {user ? (
          <div className="text-sm text-slate-300 space-y-1">
            <div>Email: {user.email}</div>
            <div>Supporter: {user.isSupporter ? 'Yes' : 'No'}</div>
            <button className="btn bg-slate-800 border border-slate-700 mt-2" onClick={logout}>
              Logout
            </button>
            {user.isSupporter && (
              <div className="mt-3 space-y-2">
                <div className="text-slate-400">Choose your cabinet theme</div>
                <div className="flex gap-2 flex-wrap">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      className={`btn border ${
                        user.supporterTheme === t.id
                          ? 'bg-emerald-500 text-slate-900 border-emerald-300'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                      onClick={() => updateTheme(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-400">Login to view profile and spin history.</div>
        )}
        <p className="disclaimer">
          History and supporter perks are cosmetic-only. No cash value. Demo balances are not withdrawable.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-3">Recent Spins</h2>
        {spins.length === 0 ? (
          <div className="text-slate-400 text-sm">No spins yet.</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {spins.map((spin) => (
              <div
                key={spin._id}
                className="flex items-center justify-between text-sm bg-slate-800/40 border border-slate-800 rounded-lg px-3 py-2"
              >
                <div className="flex gap-3">
                  <div className="font-mono text-xs text-slate-400">
                    {new Date(spin.createdAt).toLocaleString()}
                  </div>
                  <div>Bet {spin.bet}</div>
                  <div className="text-slate-300">{spin.result}</div>
                </div>
                <div className={spin.win > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                  {spin.win > 0 ? `+${spin.win} (x${spin.multiplier})` : 'No win'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
