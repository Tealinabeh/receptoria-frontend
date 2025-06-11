import { useState } from 'react';

export function StarRating({ initialRating = 0, onRatingSubmit }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (newRating) => {
    setRating(newRating);
    if (onRatingSubmit) {
      onRatingSubmit(newRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`text-3xl transition-colors duration-200 ${
              ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}