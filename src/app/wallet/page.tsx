'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, Plus, ArrowUp, ArrowDown, RefreshCw, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { walletApi, type WalletData, type TransactionData } from '@/lib/api';
import { useWalletStore } from '@/stores/walletStore';
import { format } from 'date-fns';

export default function WalletPage() {
  const { user } = useAuth();
  const { openRechargeModal } = useWalletStore();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      walletApi.getWallet().catch(() => ({ data: null })),
      walletApi.getTransactions({ limit: 50 }).catch(() => ({ data: [] as TransactionData[] })),
    ]).then(([walletRes, txnRes]) => {
      if (walletRes.data) setWallet(walletRes.data);
      setTransactions(txnRes.data || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const balance = wallet?.balance || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Balance Card */}
        <div className="rounded-2xl p-8 text-white text-center" style={{ background: 'linear-gradient(135deg, #E8530E 0%, #F07030 100%)' }}>
          <p className="text-white/80 text-sm font-medium">Wallet Balance</p>
          <p className="text-5xl font-bold mt-2 flex items-center justify-center gap-1">
            <IndianRupee className="w-10 h-10" />
            {balance.toFixed(0)}
          </p>
          <p className="text-white/70 text-sm mt-2">Available for chats & calls</p>
          <Button onClick={openRechargeModal} variant="accent" size="lg" className="mt-6 bg-white hover:bg-white/90 text-foreground shadow-lg">
            <Plus className="w-5 h-5" /> Add Money
          </Button>
        </div>

        {/* Quick Recharge */}
        <div className="mt-6">
          <h3 className="font-semibold text-foreground mb-3">Quick Recharge</h3>
          <div className="grid grid-cols-4 gap-3">
            {[100, 200, 500, 1000].map((amount) => (
              <button key={amount} onClick={openRechargeModal} className="py-3 bg-card rounded-xl border border-border text-center hover:border-primary hover:bg-primary/5 transition">
                <p className="font-bold text-foreground">₹{amount}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <h3 className="font-semibold text-foreground mb-4">Transaction History</h3>
          {transactions.length > 0 ? (
            <div className="bg-card rounded-2xl border border-border divide-y divide-border">
              {transactions.map((txn) => {
                const isCredit = txn.type === 'deposit' || txn.type === 'refund';
                return (
                  <div key={txn.id} className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCredit ? 'bg-success/10 text-success' : txn.type === 'refund' ? 'bg-blue-100 text-blue-600' : 'bg-destructive/10 text-destructive'}`}>
                      {isCredit ? <ArrowDown className="w-5 h-5" /> : txn.type === 'refund' ? <RefreshCw className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{txn.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(txn.createdAt), 'dd MMM yyyy, h:mm a')}</p>
                    </div>
                    <p className={`font-semibold text-sm ${isCredit ? 'text-success' : 'text-destructive'}`}>
                      {isCredit ? '+' : '-'}₹{Math.abs(txn.amount).toFixed(0)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <IndianRupee className="w-12 h-12 text-muted mx-auto mb-3" />
              <h4 className="font-semibold text-foreground">No transactions yet</h4>
              <p className="text-muted-foreground text-sm mt-1">Recharge your wallet to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
