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
    <div className="space-y-8">
      {/* Book Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="space-y-2 text-sm text-gray-500">
              {book.publication_year && (
                <p>Published: {book.publication_year}</p>
              )}
              {book.isbn && (
                <p>ISBN: {book.isbn}</p>
              )}
              <p>Added: {new Date(book.created_at).toLocaleDateString()}</p>
              {book.updated_at && (
                <p>Updated: {new Date(book.updated_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to={`/books/${book.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        
        {book.description && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        <ReviewList bookId={book.id} />
      </div>
    </div>
  );
};

export default BookDetail;
