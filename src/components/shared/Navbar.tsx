'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Bell, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletStore } from '@/stores/walletStore';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import WalletPill from './WalletPill';

export default function Navbar() {
  const { userProfile, logout } = useAuth();
  const { openRechargeModal } = useWalletStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/auth')) return null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Find Experts' },
    { href: '/chat', label: 'Chats' },
    ...(userProfile?.role === 'mentor' ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    ...(userProfile?.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">K</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground hidden sm:block">Konnect</h1>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {userProfile && <WalletPill onClick={openRechargeModal} />}

            {userProfile && (
              <button className="relative p-2 hover:bg-secondary rounded-lg transition">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </button>
            )}

            {userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-secondary rounded-lg transition"
                >
                  <Avatar name={userProfile.name} size="sm" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="font-semibold text-foreground text-sm">{userProfile.name}</p>
                        <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">My Profile</Link>
                      <Link href="/wallet" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">Wallet</Link>
                      {userProfile.role === 'mentor' && (
                        <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">Mentor Dashboard</Link>
                      )}
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors">Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="rounded-full px-4">Join as Expert</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-3 rounded-lg text-sm font-medium transition ${
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
