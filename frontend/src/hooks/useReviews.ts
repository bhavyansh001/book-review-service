import { useState, useEffect } from 'react';
import type { Review, PaginationParams } from '../types';
import { reviewService } from '../services/reviewService';

export const useReviews = (bookId: number, params: PaginationParams) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reviewService.getReviews(bookId, params);
        setReviews(data);
      } catch (err) {
        setError('Failed to fetch reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, params.skip, params.limit]);

  return { reviews, loading, error };
};
