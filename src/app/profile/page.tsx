'use client';

import { useState } from 'react';
import { User, Mail, Camera, ShieldCheck } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { userProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || 'Demo User');
  const [email] = useState(userProfile?.email || 'demo@konnect.com');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Avatar name={name} size="xl" />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="primary">{userProfile?.role || 'mentee'}</Badge>
                <Badge variant="success"><ShieldCheck className="w-3 h-3" /> Verified</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input type="email" value={email} disabled className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-secondary text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div className="pt-4">
              <Button onClick={handleSave} className="w-full" size="lg">{saved ? 'Saved!' : 'Save Changes'}</Button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Account</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-xl transition text-sm text-foreground">Change Password</button>
            <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-xl transition text-sm text-foreground">Notification Preferences</button>
            <button className="w-full text-left px-4 py-3 hover:bg-destructive/5 rounded-xl transition text-sm text-destructive">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
