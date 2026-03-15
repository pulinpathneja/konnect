'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/shared/Navbar';
import RechargeModal from '@/components/shared/RechargeModal';
import { useWalletStore } from '@/stores/walletStore';

function RechargeModalWrapper() {
  const { isRechargeModalOpen, closeRechargeModal } = useWalletStore();
  return <RechargeModal isOpen={isRechargeModalOpen} onClose={closeRechargeModal} />;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
      <RechargeModalWrapper />
    </AuthProvider>
  );
}
