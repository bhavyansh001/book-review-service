import React, { useState, useCallback } from 'react';
import { useReviews } from '../../hooks/useReviews';
import { reviewService } from '../../services/reviewService';
import type { Review } from '../../types';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import Pagination from '../common/Pagination';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

interface ReviewListProps {
  bookId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ bookId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const paginationParams = {
    skip: (currentPage - 1) * DEFAULT_PAGE_SIZE,
    limit: DEFAULT_PAGE_SIZE
  };

  const { reviews, total, loading, error } = useReviews(bookId, paginationParams, refreshKey);

  // Ensure reviews is always an array
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleAddReview = () => {
    setEditingReview(undefined);
    setShowForm(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(reviewId);
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingReview(undefined);
    setRefreshKey(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingReview(undefined);
  };

  if (loading) return <Loading text="Loading reviews..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Reviews ({safeReviews.length})
        </h3>
        <button
          onClick={handleAddReview}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Review
        </button>
      </div>

      {showForm && (
        <ReviewForm
          bookId={bookId}
          review={editingReview}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {safeReviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
          <p className="text-gray-500">Be the first to share your thoughts about this book!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {safeReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={total}
            itemsPerPage={DEFAULT_PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ReviewList;