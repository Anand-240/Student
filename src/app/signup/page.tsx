'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill all fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed.');
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
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ddd6fe,_#f8fafc_45%,_#e2e8f0_100%)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] border-2 border-slate-900 bg-white p-8 shadow-[10px_10px_0_0_#1a1a1a]">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-violet-600">Sign Up</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Create account</h1>
          <p className="mt-2 text-slate-600">Register to save your profile, budget and activity across sessions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border-2 border-slate-900 bg-slate-50 px-4 py-3 outline-none"
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border-2 border-slate-900 bg-slate-50 px-4 py-3 outline-none"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border-2 border-slate-900 bg-slate-50 px-4 py-3 outline-none"
            autoComplete="new-password"
          />

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl border-2 border-slate-900 bg-violet-500 px-5 py-3 font-black text-white shadow-[6px_6px_0_0_#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
