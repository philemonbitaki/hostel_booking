'use client';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (newRating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showValue = true 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const handleStarClick = (starValue: number) => {
    if (readonly) return;
    
    const newRating = starValue;
    setCurrentRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (starValue: number) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`${sizeClasses[size]} ${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-200`}
            disabled={readonly}
          >
            <span
              className={
                star <= displayRating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }
            >
              {star <= displayRating ? '★' : '☆'}
            </span>
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {currentRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
