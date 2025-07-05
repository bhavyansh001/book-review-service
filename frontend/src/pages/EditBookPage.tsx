import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Book } from '../types';
import { bookService } from '../services/bookService';
import BookForm from '../components/books/BookForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const bookData = await bookService.getBook(parseInt(id, 10));
        setBook(bookData);
      } catch (err) {
        setError('Failed to fetch book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <Loading text="Loading book details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link 
          to={`/books/${book.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Book Details
        </Link>
      </div>
      <BookForm book={book} />
    </div>
  );
};

export default EditBookPage;
