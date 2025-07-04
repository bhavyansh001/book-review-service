from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Book
from app.schemas import BookCreate, BookUpdate, BookResponse, BookWithReviews
from app.utils.cache import cache
from app.utils.validation import validate_isbn, validate_year

router = APIRouter()

@router.get("/", response_model=List[BookResponse])
async def get_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all books with pagination"""
    # Try to get from cache first
    cache_key = f"books:list:{skip}:{limit}"
    cached_books = cache.get(cache_key)
    
    if cached_books is not None:
        return cached_books
    
    # If not in cache, fetch from database
    books = db.query(Book).offset(skip).limit(limit).all()
    
    # Convert to response format
    book_responses = [BookResponse.model_validate(book) for book in books]
    
    # Cache the result
    cache.set(cache_key, [book.model_dump() for book in book_responses], expire=300)
    
    return book_responses

@router.get("/{book_id}", response_model=BookResponse)
async def get_book(book_id: int, db: Session = Depends(get_db)):
    """Get a specific book by ID"""
    # Try cache first
    cache_key = f"book:{book_id}"
    cached_book = cache.get(cache_key)
    
    if cached_book is not None:
        return cached_book
    
    # Fetch from database
    book = db.query(Book).filter(Book.id == book_id).first()
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book_response = BookResponse.model_validate(book)
    
    # Cache the result
    cache.set(cache_key, book_response.model_dump(), expire=300)
    
    return book_response

@router.get("/{book_id}/reviews", response_model=BookWithReviews)
async def get_book_with_reviews(book_id: int, db: Session = Depends(get_db)):
    """Get a book with all its reviews"""
    # Try cache first
    cache_key = f"book:reviews:{book_id}"
    cached_data = cache.get(cache_key)
    
    if cached_data is not None:
        return cached_data
    
    # Fetch from database with reviews
    book = db.query(Book).filter(Book.id == book_id).first()
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book_with_reviews = BookWithReviews.model_validate(book)
    
    # Cache the result
    cache.set(cache_key, book_with_reviews.model_dump(), expire=300)
    
    return book_with_reviews

@router.post("/", response_model=BookResponse, status_code=201)
async def create_book(book: BookCreate, db: Session = Depends(get_db)):
    """Create a new book"""
    # Validate ISBN format
    if book.isbn and not validate_isbn(book.isbn):
        raise HTTPException(status_code=400, detail="Invalid ISBN format")
    
    # Validate publication year
    if not validate_year(book.publication_year):
        raise HTTPException(status_code=400, detail="Invalid publication year")
    
    # Check if ISBN already exists
    if book.isbn:
        existing_book = db.query(Book).filter(Book.isbn == book.isbn).first()
        if existing_book:
            raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    
    # Create new book
    db_book = Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    
    # Clear cache patterns that might be affected
    cache.clear_pattern("books:list:*")
    
    return BookResponse.model_validate(db_book)

@router.put("/{book_id}", response_model=BookResponse)
async def update_book(book_id: int, book_update: BookUpdate, db: Session = Depends(get_db)):
    """Update a book"""
    # Find the book
    db_book = db.query(Book).filter(Book.id == book_id).first()
    
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Validate ISBN if provided
    if book_update.isbn and not validate_isbn(book_update.isbn):
        raise HTTPException(status_code=400, detail="Invalid ISBN format")
    
    # Validate publication year if provided
    if book_update.publication_year is not None and not validate_year(book_update.publication_year):
        raise HTTPException(status_code=400, detail="Invalid publication year")
    
    # Check if new ISBN already exists (and it's different from current)
    if book_update.isbn and book_update.isbn != db_book.isbn:
        existing_book = db.query(Book).filter(Book.isbn == book_update.isbn).first()
        if existing_book:
            raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    
    # Update fields
    update_data = book_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_book, field, value)
    
    db.commit()
    db.refresh(db_book)
    
    # Clear relevant cache entries
    cache.delete(f"book:{book_id}")
    cache.delete(f"book:reviews:{book_id}")
    cache.clear_pattern("books:list:*")
    
    return BookResponse.model_validate(db_book)

@router.delete("/{book_id}", status_code=204)
async def delete_book(book_id: int, db: Session = Depends(get_db)):
    """Delete a book"""
    # Find the book
    db_book = db.query(Book).filter(Book.id == book_id).first()
    
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Delete the book (reviews will be deleted automatically due to cascade)
    db.delete(db_book)
    db.commit()
    
    # Clear relevant cache entries
    cache.delete(f"book:{book_id}")
    cache.delete(f"book:reviews:{book_id}")
    cache.clear_pattern("books:list:*")
    
    return None