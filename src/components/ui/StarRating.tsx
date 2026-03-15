'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  count?: number;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRate,
  showValue = false,
  count,
}: StarRatingProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}
          >
            <Star
              className={`${sizeMap[size]} ${
                i < Math.floor(rating)
                  ? 'fill-accent text-accent'
                  : 'text-muted'
              }`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground ml-0.5">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
