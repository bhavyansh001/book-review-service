import api from './api';
import type { Review, ReviewFormData, PaginationParams } from '../types';

export const reviewService = {
  async getReviews(bookId: number, params: PaginationParams): Promise<Review[]> {
    const response = await api.get(`/books/${bookId}/reviews`, { params });
    return response.data;
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
