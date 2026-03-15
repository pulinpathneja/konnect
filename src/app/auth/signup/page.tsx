'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role = 'mentor' as const;
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, userProfile, signup, loginWithGoogle, setDemoUser } = useAuth();
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
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(email, password, name, role);
      router.push(role === 'mentor' ? '/dashboard' : '/explore');
    } catch { setError('Failed to create account. Try demo mode instead.'); }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      // If popup succeeded, redirect (redirect flow is handled by useEffect above)
      router.push('/dashboard');
    } catch { setError('Google sign-up failed. Try demo mode instead.'); }
  };

  const handleDemoLogin = () => {
    setDemoUser('mentor');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Konnect</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-foreground">Register as a Mentor</h1>
          <p className="mt-2 text-muted-foreground">Share your expertise and earn on Konnect</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          <div className="flex items-center justify-center gap-2 mb-6 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold">
            <ShieldCheck className="w-4 h-4" /> I am a Mentor
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition" required />
              </div>
            </div>
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
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full pl-10 pr-12 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? 'Creating account...' : 'Sign Up as Mentor'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-border" /><span className="text-sm text-muted-foreground">or</span><div className="flex-1 border-t border-border" />
          </div>

          <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl hover:bg-secondary transition font-medium text-foreground">
            <FcGoogle className="w-5 h-5" /> Continue with Google
          </button>

          <button onClick={handleDemoLogin} className="w-full mt-3 py-2.5 bg-success/10 text-success border border-success/20 rounded-xl text-sm font-semibold hover:bg-success/20 transition">Try Demo as Mentor</button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}<Link href="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
