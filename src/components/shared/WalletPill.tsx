'use client';

import { Wallet } from 'lucide-react';
import { useWalletStore } from '@/stores/walletStore';

interface WalletPillProps {
  onClick?: () => void;
  className?: string;
}

export default function WalletPill({ onClick, className = '' }: WalletPillProps) {
  const { balance } = useWalletStore();

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-semibold hover:bg-success/20 transition ${className}`}
    >
      <Wallet className="w-4 h-4" />
      ₹{balance.toFixed(0)}
    </button>
  );
}
