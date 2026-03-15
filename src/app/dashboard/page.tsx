'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IndianRupee, MessageSquare, Phone, Clock, TrendingUp, Star, Users, Calendar, Loader2, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { sessionApi, walletApi, type SessionData, type WalletData } from '@/lib/api';
import { connectSocket, registerAsExpert, disconnectSocket, getSocket } from '@/lib/socket';

interface PendingRequest {
  id: string;
  name: string;
  topic: string;
  time: string;
  userId: string;
  expertId: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof ShieldCheck }> = {
  applied: { label: 'Application Submitted — Under Review', color: 'bg-amber-50 border-amber-200 text-amber-800', icon: Clock },
  documents_verified: { label: 'Documents Verified — Scheduling Call', color: 'bg-blue-50 border-blue-200 text-blue-800', icon: ShieldCheck },
  call_scheduled: { label: 'Verification Call Scheduled', color: 'bg-blue-50 border-blue-200 text-blue-800', icon: Phone },
  call_done: { label: 'Call Completed — Decision Pending', color: 'bg-purple-50 border-purple-200 text-purple-800', icon: Clock },
  rejected: { label: 'Application Not Approved', color: 'bg-red-50 border-red-200 text-red-800', icon: XCircle },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, mentorStatusInfo } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionIcons = { chat: MessageSquare, voice: Phone, video: Phone };

  // Fetch sessions and wallet data
  useEffect(() => {
    if (!user) return;

    Promise.all([
      sessionApi.getExpertSessions({ limit: 50 }).catch(() => ({ data: [] as SessionData[] })),
      walletApi.getWallet().catch(() => ({ data: null })),
    ]).then(([sessionsRes, walletRes]) => {
      setSessions(sessionsRes.data || []);
      if (walletRes.data) setWallet(walletRes.data);
    }).finally(() => setLoading(false));
  }, [user]);

  // Connect socket when going online
  const toggleOnline = useCallback(async () => {
    if (!user || !userProfile) return;

    if (!isOnline) {
      try {
        await connectSocket();
        registerAsExpert(user.uid, userProfile.name);
        setIsOnline(true);

        const socket = getSocket();
        if (socket) {
          socket.on('chat-request', (data: { userId: string; userName: string; expertId: string }) => {
            setPendingRequests(prev => [...prev, {
              id: `req-${Date.now()}`,
              name: data.userName,
              topic: 'Chat request',
              time: 'Just now',
              userId: data.userId,
              expertId: data.expertId,
            }]);
          });
        }
      } catch (err) {
        console.error('Failed to go online:', err);
      }
    } else {
      disconnectSocket();
      setIsOnline(false);
      setPendingRequests([]);
    }
  }, [isOnline, user, userProfile]);

  // Compute earnings from sessions
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const earningsData = {
    today: completedSessions.filter(s => new Date(s.createdAt) >= todayStart).reduce((sum, s) => sum + (s.totalAmount || 0), 0),
    thisWeek: completedSessions.filter(s => new Date(s.createdAt) >= weekStart).reduce((sum, s) => sum + (s.totalAmount || 0), 0),
    thisMonth: completedSessions.filter(s => new Date(s.createdAt) >= monthStart).reduce((sum, s) => sum + (s.totalAmount || 0), 0),
    total: completedSessions.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
  };

  const recentSessions = completedSessions.slice(0, 5).map((s, i) => ({
    id: s.id || i,
    menteeName: `User ${(s.userId || '').substring(0, 6)}`,
    type: (s.type || 'chat') as 'chat' | 'voice' | 'video',
    duration: `${s.duration || 0} min`,
    earned: s.totalAmount || 0,
    time: new Date(s.createdAt).toLocaleDateString(),
    rating: 5,
  }));

  const mentorStatus = mentorStatusInfo?.mentorStatus;
  const isApproved = !mentorStatus || mentorStatus === 'approved'; // no mentorStatus = demo/legacy approved
  const isRejected = mentorStatus === 'rejected';

  // Redirect to onboarding if no mentor profile
  useEffect(() => {
    if (!loading && mentorStatusInfo && !mentorStatusInfo.hasProfile && userProfile?.uid !== 'user-demo') {
      router.push('/onboarding');
    }
  }, [loading, mentorStatusInfo, userProfile, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Status Banner for unapproved mentors */}
        {!isApproved && mentorStatus && STATUS_LABELS[mentorStatus] && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${STATUS_LABELS[mentorStatus].color}`}>
            {(() => { const Icon = STATUS_LABELS[mentorStatus].icon; return <Icon className="w-5 h-5 shrink-0" />; })()}
            <div className="flex-1">
              <p className="font-semibold text-sm">{STATUS_LABELS[mentorStatus].label}</p>
              <p className="text-xs mt-0.5 opacity-80">
                {isRejected
                  ? 'You can update your profile and re-apply.'
                  : 'Your dashboard is in read-only mode until your profile is approved.'}
              </p>
            </div>
            {isRejected && (
              <Button size="sm" variant="ghost" onClick={() => router.push('/onboarding')}>Re-apply</Button>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mentor Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Welcome back, {userProfile?.name || 'Mentor'}!</p>
          </div>
          <div className={`flex items-center gap-3 bg-card px-4 py-2.5 rounded-xl border border-border ${!isApproved ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="text-sm font-medium text-foreground">{isOnline ? 'Online' : 'Offline'}</span>
            <button onClick={toggleOnline} disabled={!isApproved} className={`w-12 h-6 rounded-full transition-colors ${isOnline ? 'bg-success' : 'bg-muted'} disabled:cursor-not-allowed`}>
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${isOnline ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Today', value: earningsData.today, icon: Clock, color: 'bg-primary/10 text-primary' },
            { label: 'This Week', value: earningsData.thisWeek, icon: Calendar, color: 'bg-success/10 text-success' },
            { label: 'This Month', value: earningsData.thisMonth, icon: TrendingUp, color: 'bg-accent/10 text-accent-foreground' },
            { label: 'Total Earnings', value: earningsData.total, icon: IndianRupee, color: 'bg-[#8B5CF6]/10 text-[#8B5CF6]' },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}><item.icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                  <p className="text-xl font-bold text-foreground">₹{item.value.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border">
              <div className="px-6 py-4 border-b border-border"><h3 className="font-semibold text-foreground">Recent Sessions</h3></div>
              <div className="divide-y divide-border">
                {recentSessions.length === 0 ? (
                  <div className="px-6 py-8 text-center text-muted-foreground text-sm">No sessions yet. Go online to start receiving requests!</div>
                ) : recentSessions.map((session) => {
                  const Icon = sessionIcons[session.type] || MessageSquare;
                  return (
                    <div key={session.id} className="flex items-center gap-4 px-6 py-4">
                      <Avatar name={session.menteeName} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm">{session.menteeName}</p>
                          <Badge variant="secondary"><Icon className="w-3 h-3" />{session.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{session.duration} &bull; {session.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success text-sm">+₹{session.earned}</p>
                        <div className="flex gap-0.5 mt-0.5">{Array.from({ length: session.rating }, (_, i) => (<Star key={i} className="w-3 h-3 fill-accent text-accent" />))}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between"><h3 className="font-semibold text-foreground">Pending Requests</h3><Badge variant="danger">{pendingRequests.length}</Badge></div>
              </div>
              <div className="divide-y divide-border">
                {pendingRequests.length === 0 ? (
                  <div className="px-5 py-6 text-center text-muted-foreground text-sm">
                    {isOnline ? 'No pending requests' : 'Go online to receive requests'}
                  </div>
                ) : pendingRequests.map((req) => (
                  <div key={req.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1"><p className="font-medium text-foreground text-sm">{req.name}</p><span className="text-xs text-muted-foreground">{req.time}</span></div>
                    <p className="text-xs text-muted-foreground mb-2">{req.topic}</p>
                    <div className="flex gap-2"><Button size="sm" className="flex-1" disabled={!isApproved}>Accept</Button><Button size="sm" variant="ghost" className="flex-1" disabled={!isApproved}>Decline</Button></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Sessions', value: completedSessions.length.toLocaleString(), icon: Users },
                  { label: 'Avg per Session', value: completedSessions.length > 0 ? `₹${Math.round(earningsData.total / completedSessions.length)}` : '₹0', icon: TrendingUp },
                  { label: 'Wallet Balance', value: `₹${(wallet?.balance || 0).toLocaleString()}`, icon: IndianRupee },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><stat.icon className="w-4 h-4" />{stat.label}</div>
                    <p className="font-semibold text-foreground text-sm">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-2">Available for Withdrawal</h3>
              <p className="text-3xl font-bold text-foreground mb-4">₹{(wallet?.balance || 0).toLocaleString()}</p>
              <Button variant="accent" className="w-full bg-success text-success-foreground hover:bg-success/90">Request Withdrawal</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
