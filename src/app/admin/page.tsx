'use client';

import { useState } from 'react';
import { Users, IndianRupee, MessageSquare, TrendingUp, ShieldCheck, Ban, Search, Eye } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mentors, categories } from '@/lib/mock-data';

const adminStats = { totalUsers: 12450, activeSessions: 89, revenue: 2450000, mentorsOnline: 234 };

const allUsers = [
  { uid: 'u1', name: 'Amit Kumar', email: 'amit@email.com', role: 'mentee' as const, status: 'active', joined: '2024-01-15' },
  { uid: 'u2', name: 'Priya Sharma', email: 'priya@email.com', role: 'mentor' as const, status: 'active', joined: '2023-11-20', verified: true },
  { uid: 'u3', name: 'Rahul Verma', email: 'rahul@email.com', role: 'mentor' as const, status: 'active', joined: '2023-12-05', verified: true },
  { uid: 'u4', name: 'Sneha Patel', email: 'sneha@email.com', role: 'mentor' as const, status: 'pending', joined: '2024-12-28', verified: false },
  { uid: 'u5', name: 'Karan M.', email: 'karan@email.com', role: 'mentee' as const, status: 'active', joined: '2024-06-10' },
  { uid: 'u6', name: 'Deepak S.', email: 'deepak@email.com', role: 'mentee' as const, status: 'banned', joined: '2024-03-22' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'mentors' | 'categories' | 'analytics'>('users');
  const [search, setSearch] = useState('');

  const filteredUsers = allUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Admin Panel</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage users, mentors, and platform analytics.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), icon: Users, color: 'bg-primary/10 text-primary' },
            { label: 'Active Sessions', value: adminStats.activeSessions.toString(), icon: MessageSquare, color: 'bg-success/10 text-success' },
            { label: 'Total Revenue', value: `₹${(adminStats.revenue / 100000).toFixed(1)}L`, icon: IndianRupee, color: 'bg-accent/10 text-accent-foreground' },
            { label: 'Mentors Online', value: adminStats.mentorsOnline.toString(), icon: TrendingUp, color: 'bg-[#8B5CF6]/10 text-[#8B5CF6]' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}><stat.icon className="w-5 h-5" /></div>
                <div><p className="text-xs text-muted-foreground font-medium">{stat.label}</p><p className="text-xl font-bold text-foreground">{stat.value}</p></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-card rounded-xl border border-border p-1 w-fit mb-6">
          {(['users', 'mentors', 'categories', 'analytics'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition capitalize ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>{tab}</button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="bg-card rounded-2xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg outline-none text-sm focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground text-left"><th className="px-6 py-3 font-medium">User</th><th className="px-6 py-3 font-medium">Role</th><th className="px-6 py-3 font-medium">Status</th><th className="px-6 py-3 font-medium">Joined</th><th className="px-6 py-3 font-medium">Actions</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-secondary/50">
                      <td className="px-6 py-3"><div className="flex items-center gap-3"><Avatar name={user.name} size="sm" /><div><p className="font-medium text-foreground">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div></div></td>
                      <td className="px-6 py-3"><Badge variant={user.role === 'mentor' ? 'primary' : 'secondary'}>{user.role}</Badge></td>
                      <td className="px-6 py-3"><Badge variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'}>{user.status}</Badge></td>
                      <td className="px-6 py-3 text-muted-foreground">{user.joined}</td>
                      <td className="px-6 py-3"><div className="flex gap-1">
                        <button className="p-1.5 hover:bg-secondary rounded-lg"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                        {user.role === 'mentor' && !('verified' in user && user.verified) && (<button className="p-1.5 hover:bg-success/10 rounded-lg"><ShieldCheck className="w-4 h-4 text-success" /></button>)}
                        <button className="p-1.5 hover:bg-destructive/10 rounded-lg"><Ban className="w-4 h-4 text-destructive" /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Registered Mentors ({mentors.length})</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mentors.map((mentor) => (
                <div key={mentor.uid} className="border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3"><Avatar name={mentor.name} size="md" isOnline={mentor.isOnline} /><div><p className="font-semibold text-foreground text-sm">{mentor.name}</p><div className="flex gap-1 mt-0.5">{mentor.isVerified && <Badge variant="success">Verified</Badge>}</div></div></div>
                  <div className="text-xs text-muted-foreground space-y-1"><p>Sessions: {mentor.totalSessions} | Rating: {mentor.rating}</p><p>Price: ₹{mentor.pricePerMin}/min</p></div>
                  <div className="flex gap-2 mt-3"><Button size="sm" variant="ghost" className="flex-1">View</Button>{!mentor.isVerified && (<Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground">Verify</Button>)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-foreground">Categories ({categories.length})</h3><Button size="sm">Add Category</Button></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="border border-border rounded-xl p-4 flex items-center gap-4"><span className="text-3xl">{cat.icon}</span><div className="flex-1"><p className="font-semibold text-foreground text-sm">{cat.name}</p><p className="text-xs text-muted-foreground">{cat.mentorCount} mentors</p></div><Button size="sm" variant="ghost">Edit</Button></div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-6">Platform Analytics</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-border rounded-xl p-5">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Revenue Breakdown</h4>
                <div className="space-y-3">
                  {[{ label: 'Chat Sessions', value: '₹12.5L', pct: 45 }, { label: 'Voice Calls', value: '₹8.2L', pct: 30 }, { label: 'Video Calls', value: '₹5.8L', pct: 21 }, { label: 'Refunds', value: '-₹1.0L', pct: 4 }].map((item) => (
                    <div key={item.label}><div className="flex items-center justify-between text-sm mb-1"><span className="text-foreground">{item.label}</span><span className="font-semibold text-foreground">{item.value}</span></div><div className="w-full bg-secondary rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${item.pct}%` }} /></div></div>
                  ))}
                </div>
              </div>
              <div className="border border-border rounded-xl p-5">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Platform Health</h4>
                <div className="space-y-4">
                  {[{ label: 'Avg Session Duration', value: '18 min' }, { label: 'User Retention (30d)', value: '72%' }, { label: 'Mentor Response Rate', value: '94%' }, { label: 'Avg Rating', value: '4.7 / 5' }, { label: 'Dispute Rate', value: '0.3%' }].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{item.label}</span><span className="font-semibold text-foreground">{item.value}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
