import React from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onDelete?: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            <Link 
              to={`/books/${book.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {book.title}
            </Link>
          </h3>
          <p className="text-gray-600 mb-2">by {book.author}</p>
          {book.publication_year && (
            <p className="text-sm text-gray-500 mb-2">
              Published: {book.publication_year}
            </p>
          )}
          {book.isbn && (
            <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
          )}
        </div>
      </div>
      
      {book.description && (
        <p className="text-gray-700 mb-4 line-clamp-3">
          {book.description.length > 150 
            ? `${book.description.substring(0, 150)}...` 
            : book.description
          }
        </p>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Added: {new Date(book.created_at).toLocaleDateString()}
        </span>
        <div className="flex space-x-2">
          <Link
            to={`/books/${book.id}`}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <Link
            to={`/books/${book.id}/edit`}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Edit
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(book.id)}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
