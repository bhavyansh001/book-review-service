from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Book, Review
from app.schemas import ReviewCreate, ReviewUpdate, ReviewResponse
from app.utils.cache import cache
from app.utils.validation import validate_rating

router = APIRouter()

@router.get("/{book_id}/reviews", response_model=List[ReviewResponse])
async def get_reviews_for_book(
    book_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all reviews for a specific book with pagination"""
    # Check if book exists
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Try cache first
    cache_key = f"reviews:book:{book_id}:{skip}:{limit}"
    cached_reviews = cache.get(cache_key)
    
    if cached_reviews is not None:
        return cached_reviews
    
    # Fetch from database
    reviews = (
        db.query(Review)
        .filter(Review.book_id == book_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    review_responses = [ReviewResponse.model_validate(review) for review in reviews]
    
    # Cache the result
    cache.set(cache_key, [review.model_dump() for review in review_responses], expire=300)
    
    return review_responses

@router.post("/{book_id}/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(
    book_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    """Create a new review for a book"""
    # Check if book exists
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Validate rating
    if not validate_rating(review.rating):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Create new review
    db_review = Review(**review.model_dump(), book_id=book_id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Clear relevant cache entries
    cache.clear_pattern(f"reviews:book:{book_id}:*")
    cache.delete(f"book:reviews:{book_id}")
    
    return ReviewResponse.model_validate(db_review)

@router.get("/reviews/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: int, db: Session = Depends(get_db)):
    """Get a specific review by ID"""
    # Try cache first
    cache_key = f"review:{review_id}"
    cached_review = cache.get(cache_key)
    
    if cached_review is not None:
        return cached_review
    
    # Fetch from database
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review_response = ReviewResponse.model_validate(review)
    
    # Cache the result
    cache.set(cache_key, review_response.model_dump(), expire=300)
    
    return review_response

@router.put("/reviews/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    db: Session = Depends(get_db)
):
    """Update a review"""
    # Find the review
    db_review = db.query(Review).filter(Review.id == review_id).first()
    
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Validate rating if provided
    if review_update.rating is not None and not validate_rating(review_update.rating):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Update fields
    update_data = review_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_review, field, value)
    
    db.commit()
    db.refresh(db_review)
    
    # Clear relevant cache entries
    cache.delete(f"review:{review_id}")
    cache.clear_pattern(f"reviews:book:{db_review.book_id}:*")
    cache.delete(f"book:reviews:{db_review.book_id}")
    
    return ReviewResponse.model_validate(db_review)

@router.delete("/reviews/{review_id}", status_code=204)
async def delete_review(review_id: int, db: Session = Depends(get_db)):
    """Delete a review"""
    # Find the review
    db_review = db.query(Review).filter(Review.id == review_id).first()
    
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    book_id = db_review.book_id
    
    # Delete the review
    db.delete(db_review)
    db.commit()
    
    # Clear relevant cache entries
    cache.delete(f"review:{review_id}")
    cache.clear_pattern(f"reviews:book:{book_id}:*")
    cache.delete(f"book:reviews:{book_id}")
    
    return None