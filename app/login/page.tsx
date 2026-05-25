'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, addToast } = useAppStore();
  const [email, setEmail] = useState('james@geotradez.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await useAppStore.getState().register(email, password, name);
      }
      addToast(mode === 'login' ? 'Welcome back!' : 'Account created!');
      router.push('/discover');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7e8] to-[#e8f4fc] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#dce8f2] p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#4A7C24] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">GeoTradez</h1>
          <p className="text-[#6B7280] mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create your seller account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#dce8f2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C24]/30"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#dce8f2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C24]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-[#dce8f2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C24]/30"
            />
          </div>
          {mode === 'login' && (
            <p className="text-xs text-[#6B7280]">
              Demo: james@geotradez.com / password123
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A7C24] text-white font-semibold rounded-lg hover:bg-[#3A6B1A] transition-colors disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button type="button" onClick={() => setMode('register')} className="text-[#4A7C24] font-medium hover:underline">
                Register
              </button>
            </>
          ) : (
            <>
              Have an account?{' '}
              <button type="button" onClick={() => setMode('login')} className="text-[#4A7C24] font-medium hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-[#6B7280] hover:text-[#4A7C24]">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
