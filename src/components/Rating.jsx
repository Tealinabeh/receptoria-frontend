export function Rating({ rating = 0 }) {
    const numericRating = parseFloat(rating);

    if (isNaN(numericRating) || numericRating <= 0) {
        return null;
    }

    const displayRating = numericRating.toFixed(1);

    return (
        <div className="flex items-center space-x-1 text-lg text-black">
            <p className="w-6 h-6 -translate-y-1">⭐</p>
            <p>{displayRating}</p>
        </div>
    );
}
