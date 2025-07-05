import { useState, useEffect } from 'react';
import type { Book } from '../types';
import { bookService } from '../services/bookService';

export const useBook = (id: number, refreshKey?: number) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getBook(id);
      setBook(data);
    } catch (err) {
      setError('Failed to fetch book details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id, refreshKey]);

  return { book, loading, error, refetch: fetchBook };
};
