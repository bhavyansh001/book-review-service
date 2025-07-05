import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Book } from '../../types';
import { bookService } from '../../services/bookService';
import ReviewList from '../reviews/ReviewList';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    if (!book) return;
    
    if (window.confirm('Are you sure you want to delete this book? This will also delete all reviews.')) {
      try {
        await bookService.deleteBook(book.id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  if (loading) return <Loading text="Loading book details..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  return (
    <div className="space-y-10">
      {/* Book Details */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 border border-white/40">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            {book.title}
          </h1>
          <p className="text-lg text-gray-600 mb-1">by <span className="font-semibold">{book.author}</span></p>
          <p className="text-sm text-gray-400 mb-4">{book.publication_year ? `${book.publication_year}` : ''}</p>
          <p className="text-gray-700 mb-6 whitespace-pre-line">{book.description || <span className="italic text-gray-400">No description provided.</span>}</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              to={`/books/${book.id}/edit`}
              className="px-5 py-2 rounded-md bg-yellow-400 text-white font-semibold hover:bg-yellow-500 transition-colors shadow"
            >
              Edit Book
            </Link>
            <button
              onClick={handleDelete}
              className="px-5 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow"
            >
              Delete Book
            </button>
            <Link
              to="/"
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors"
            >
              Back to Books
            </Link>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
        <ReviewList bookId={book.id} />
      </div>
    </div>
  );
};

export default BookDetail;
