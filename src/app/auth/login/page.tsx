'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, userProfile, login, loginWithGoogle, setDemoUser } = useAuth();
  const router = useRouter();

  // Redirect authenticated users (e.g. returning from Google redirect)
  useEffect(() => {
    if (user && userProfile) {
      router.push('/dashboard');
    }
  }, [user, userProfile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch { setError('Invalid email or password. Try demo mode instead.'); }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch { setError('Google sign-in failed. Try demo mode instead.'); }
  };

  const handleDemoLogin = (role: 'mentee' | 'mentor') => {
    setDemoUser(role);
    router.push(role === 'mentor' ? '/dashboard' : '/explore');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Konnect</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-foreground">Mentor Login</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your mentor dashboard</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-10 pr-12 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl hover:bg-secondary transition font-medium text-foreground">
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="mt-6">
            <button onClick={() => handleDemoLogin('mentor')} className="w-full py-2.5 bg-success/10 text-success border border-success/20 rounded-xl text-sm font-semibold hover:bg-success/20 transition">Try Demo as Mentor</button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
