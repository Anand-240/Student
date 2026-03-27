'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        setLoading(false);
        return;
      }

      if (data.user) {
        try {
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch {
          // ignore storage errors
        }
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#f8fafc_45%,_#e2e8f0_100%)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] border-2 border-slate-900 bg-white p-8 shadow-[10px_10px_0_0_#1a1a1a]">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-600">Login</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Welcome back</h1>
          <p className="mt-2 text-slate-600">Sign in to access your dashboard, budget, and community tools.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border-2 border-slate-900 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border-2 border-slate-900 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl border-2 border-slate-900 bg-slate-950 px-5 py-3 font-black text-white shadow-[6px_6px_0_0_#ea7a34] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          New here?{' '}
          <Link href="/signup" className="font-bold underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
