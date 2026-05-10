
'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
};

export default function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = maxRating - Math.ceil(rating);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="text-yellow-400 fill-yellow-400"
        />
      ))}
      {partialStar > 0 && (
        <div className="relative">
          <Star
            key="partial"
            size={size}
            className="text-yellow-400 fill-muted"
          />
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star
              key="partial-fill"
              size={size}
              className="text-yellow-400 fill-yellow-400"
            />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-yellow-400 fill-muted"
        />
      ))}
    </div>
  );
}
