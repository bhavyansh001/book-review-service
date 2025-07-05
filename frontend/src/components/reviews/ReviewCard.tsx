import React from 'react';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (id: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{review.reviewer_name}</h4>
          <div className="flex items-center mt-1">
            {renderStars(review.rating)}
            <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
          </div>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      {review.comment && (
        <p className="text-gray-700 mb-3">{review.comment}</p>
      )}
      
      <p className="text-xs text-gray-500">
        {new Date(review.created_at).toLocaleDateString()}
        {review.updated_at && review.updated_at !== review.created_at && (
          <span> (edited {new Date(review.updated_at).toLocaleDateString()})</span>
        )}
      </p>
    </div>
  );
};

export default ReviewCard;