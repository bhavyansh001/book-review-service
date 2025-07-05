import api from './api';
import type { Book, BookFormData, PaginationParams } from '../types';

export const bookService = {
  async getBooks(params: PaginationParams): Promise<Book[]> {
    const response = await api.get('/books', { params });
    return response.data;
  },

  async getBook(id: number): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async createBook(bookData: BookFormData): Promise<Book> {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  async updateBook(id: number, bookData: BookFormData): Promise<Book> {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  async deleteBook(id: number): Promise<void> {
    await api.delete(`/books/${id}`);
  },

  async getBookWithReviews(id: number): Promise<Book> {
    const response = await api.get(`/books/${id}/reviews`);
    return response.data;
  },
};
