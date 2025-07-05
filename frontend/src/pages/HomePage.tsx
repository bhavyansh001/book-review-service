import React from 'react';
import BookList from '../components/books/BookList';

const HomePage: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <BookList />
    </div>
  );
};

export default HomePage;
