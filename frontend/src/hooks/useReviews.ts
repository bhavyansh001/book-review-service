import { useState, useEffect } from 'react';
import type { Review, PaginationParams } from '../types';
import { reviewService } from '../services/reviewService';

export const useReviews = (bookId: number, params: PaginationParams, refreshKey?: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewService.getReviews(bookId, params);
      setReviews(data.items);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchReviews();
    }
  }, [bookId, params.skip, params.limit, refreshKey]);

  return { reviews, total, loading, error, refetch: fetchReviews };
};
