import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book, BookFormData } from '../../types';
import { bookService } from '../../services/bookService';

interface BookFormProps {
  book?: Book;
  onSubmit?: (data: BookFormData) => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    publication_year: undefined
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        description: book.description || '',
        publication_year: book.publication_year
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        isbn: formData.isbn || undefined,
        description: formData.description || undefined,
        publication_year: formData.publication_year || undefined
      };

      if (onSubmit) {
        await onSubmit(submitData);
      } else if (book) {
        await bookService.updateBook(book.id, submitData);
      } else {
        await bookService.createBook(submitData);
      }

      navigate('/');
    } catch (err) {
      setError('Failed to save book. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{book ? 'Edit Book' : 'Add New Book'}</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Book title"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Author<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Publication Year</label>
          <input
            type="number"
            name="publication_year"
            value={formData.publication_year || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. 2022"
            min={0}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">ISBN</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="ISBN number"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder="Book description"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow"
          disabled={loading}
        >
          {loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
