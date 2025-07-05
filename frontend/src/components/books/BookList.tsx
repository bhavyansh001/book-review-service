import React, { useState, useCallback } from 'react';
import { useBooks } from '../../hooks/useBooks';
import { bookService } from '../../services/bookService';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import Pagination from '../common/Pagination';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { Link } from 'react-router-dom';

const BookList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginationParams = {
    skip: (currentPage - 1) * DEFAULT_PAGE_SIZE,
    limit: DEFAULT_PAGE_SIZE
  };

  const { books, loading, error, refetch } = useBooks(paginationParams);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        refetch();
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  if (loading) return <Loading text="Loading books..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 shadow-md">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Books</h1>
        </div>
        <Link
          to="/books/new"
          className="inline-block bg-gradient-to-tr from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition-colors font-semibold"
        >
          + Add Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-lg text-gray-500 mb-2">No books found</p>
          <Link
            to="/books/new"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Add your first book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {books.map((book) => (
            <div key={book.id} className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-7 flex flex-col justify-between border border-white/40 group overflow-hidden">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1 truncate flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  {book.title}
                </h2>
                <p className="text-gray-500 mb-2">by {book.author}</p>
                <p className="text-gray-700 line-clamp-3 mb-4">{book.description || 'No description.'}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Link
                  to={`/books/${book.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Details
                </Link>
                <div className="flex gap-2">
                  <Link
                    to={`/books/${book.id}/edit`}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors text-xs font-semibold"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-8">
        <Pagination
          currentPage={currentPage}
          totalItems={books.length}
          itemsPerPage={DEFAULT_PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BookList;
