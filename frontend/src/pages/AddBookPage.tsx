import React from 'react';
import { Link } from 'react-router-dom';
import BookForm from '../components/books/BookForm';

const AddBookPage: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Books
        </Link>
      </div>
      <BookForm />
    </div>
  );
};

export default AddBookPage;
