import api from './api';
import type { Review, ReviewFormData, PaginationParams } from '../types';

export const reviewService = {
  async getReviews(bookId: number, params: PaginationParams): Promise<{ items: Review[]; total: number }> {
    const response = await api.get(`/books/${bookId}/reviews`, { params });
    // The backend returns a book object with a 'reviews' array
    const reviews = Array.isArray(response.data.reviews) ? response.data.reviews : [];
    return { items: reviews, total: reviews.length };
  },

  async getReview(reviewId: number): Promise<Review> {
    const response = await api.get(`/books/reviews/${reviewId}`);
    return response.data;
  },

  async createReview(bookId: number, reviewData: ReviewFormData): Promise<Review> {
    const response = await api.post(`/books/${bookId}/reviews`, reviewData);
    return response.data;
  },

  async updateReview(reviewId: number, reviewData: ReviewFormData): Promise<Review> {
    const response = await api.put(`/books/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  async deleteReview(reviewId: number): Promise<void> {
    await api.delete(`/books/reviews/${reviewId}`);
  },
};
