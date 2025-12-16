'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '../../../components/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      push('Welcome back!', 'success');
      const next = searchParams.get('next') || '/slot';
      router.push(next);
    } else {
      push(data.error || 'Login failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Email</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Password</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="btn bg-cyan-500 text-slate-900 w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <div className="text-sm text-slate-400 mt-4">
        New here?{' '}
        <Link className="text-cyan-400" href="/auth/register">
          Create an account
        </Link>
      </div>
    </div>
  );
}
