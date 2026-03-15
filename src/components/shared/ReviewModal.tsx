'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorName: string;
  onSubmit: (rating: number, comment: string) => void;
}

export default function ReviewModal({ isOpen, onClose, mentorName, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate Your Session" size="sm">
      {submitted ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-lg font-semibold text-foreground">Thank you!</h3>
          <p className="text-muted-foreground mt-1">Your review has been submitted</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-muted-foreground">How was your session with</p>
            <p className="text-lg font-semibold text-foreground">{mentorName}?</p>
          </div>

          <div className="flex justify-center mb-6">
            <StarRating rating={rating} size="lg" interactive onRate={setRating} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-1">
              Share your experience (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <Button onClick={handleSubmit} disabled={rating === 0} className="w-full" size="lg">
            Submit Review
          </Button>
        </>
      )}
    </Modal>
  );
}
