import { useState, useEffect } from 'react';
import type { Book, PaginationParams } from '../types';
import { bookService } from '../services/bookService';

export const useBooks = (params: PaginationParams) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getBooks(params);
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.skip, params.limit]);

  return { books, loading, error, refetch: fetchBooks };
};
