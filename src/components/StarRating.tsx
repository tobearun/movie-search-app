"use client";

import { useState, useEffect } from "react";

export default function StarRating({ movieId }: { movieId: string }) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`rating-${movieId}`);
    if (saved) setRating(Number(saved));
  }, [movieId]);

  const handleClick = (star: number) => {
    localStorage.setItem(`rating-${movieId}`, String(star));
    setRating(star);
  };

  return (
    <div className="flex gap-1 mt-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          className={star <= rating ? "text-yellow-400" : "text-gray-400"}
        >
          ★
        </button>
      ))}
    </div>
  );
}
