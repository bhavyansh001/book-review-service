from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    isbn: Optional[str] = Field(None, min_length=10, max_length=13)
    description: Optional[str] = None
    publication_year: Optional[int] = Field(None, ge=1, le=2024)

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    author: Optional[str] = Field(None, min_length=1, max_length=255)
    isbn: Optional[str] = Field(None, min_length=10, max_length=13)
    description: Optional[str] = None
    publication_year: Optional[int] = Field(None, ge=1, le=2024)

class BookResponse(BookBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class BookWithReviews(BookResponse):
    reviews: List['ReviewResponse'] = []
    
    class Config:
        from_attributes = True

# Forward reference for circular import
from .review import ReviewResponse
BookWithReviews.model_rebuild()