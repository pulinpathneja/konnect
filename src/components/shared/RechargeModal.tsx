'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useWalletStore } from '@/stores/walletStore';
import { IndianRupee, CheckCircle } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addBalance, balance } = useWalletStore();

  const amount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleRecharge = async () => {
    if (!amount || amount < 10) return;
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    addBalance(amount, `Wallet recharge - ₹${amount}`, `pay_${Date.now()}`);
    setProcessing(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setCustomAmount('');
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recharge Wallet" size="sm">
      {success ? (
        <div className="text-center py-6">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">Recharge Successful!</h3>
          <p className="text-muted-foreground mt-1">₹{amount} added to your wallet</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-3xl font-bold text-foreground flex items-center justify-center gap-1 mt-1">
              <IndianRupee className="w-7 h-7" />
              {balance.toFixed(0)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                className={`py-3 rounded-xl text-sm font-semibold transition border-2 ${
                  selectedAmount === amt && !customAmount
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-foreground hover:border-muted-foreground'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-1">Custom Amount</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                min={10}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <Button onClick={handleRecharge} disabled={processing || !amount || amount < 10} className="w-full" size="lg">
            {processing ? 'Processing...' : `Pay ₹${amount || 0}`}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Secure payment via Razorpay/Stripe. Money is non-refundable.
          </p>
        </>
      )}
    </Modal>
  );
}
