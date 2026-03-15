import { create } from 'zustand';
import { Transaction } from '@/lib/types';
import { sampleTransactions } from '@/lib/mock-data';

interface WalletState {
  balance: number;
  currency: string;
  transactions: Transaction[];
  isRechargeModalOpen: boolean;
  addBalance: (amount: number, description: string, paymentId?: string) => void;
  deductBalance: (amount: number, description: string) => void;
  openRechargeModal: () => void;
  closeRechargeModal: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 870,
  currency: 'INR',
  transactions: sampleTransactions,
  isRechargeModalOpen: false,

  addBalance: (amount: number, description: string, paymentId?: string) =>
    set((state) => ({
      balance: state.balance + amount,
      transactions: [
        {
          id: `txn-${Date.now()}`,
          userId: 'user-demo',
          amount,
          type: 'recharge' as const,
          description,
          paymentId,
          createdAt: new Date(),
        },
        ...state.transactions,
      ],
    })),

  deductBalance: (amount: number, description: string) =>
    set((state) => ({
      balance: Math.max(0, state.balance - amount),
      transactions: [
        {
          id: `txn-${Date.now()}`,
          userId: 'user-demo',
          amount: -amount,
          type: 'debit' as const,
          description,
          createdAt: new Date(),
        },
        ...state.transactions,
      ],
    })),

  openRechargeModal: () => set({ isRechargeModalOpen: true }),
  closeRechargeModal: () => set({ isRechargeModalOpen: false }),
}));
