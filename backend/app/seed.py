import os
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database.connection import SessionLocal
from app.models import Book
from app.models import Review

# Only seed if there are no books

def seed():
    db: Session = SessionLocal()
    if db.query(Book).count() > 0:
        print("Seed: Books already exist, skipping seeding.")
        db.close()
        return

    # Create 3 books
    books = [
        Book(title="The Pragmatic Programmer", author="Andrew Hunt", isbn="9780201616224", description="A classic book for software engineers."),
        Book(title="Clean Code", author="Robert C. Martin", isbn="9780132350884", description="A handbook of agile software craftsmanship."),
        Book(title="Deep Work", author="Cal Newport", isbn="9781455586691", description="Rules for focused success in a distracted world."),
    ]
    db.add_all(books)
    db.commit()
    db.refresh(books[0])
    db.refresh(books[1])
    db.refresh(books[2])
    print(f"Book IDs: {[b.id for b in books]}")

    # Add 2-3 reviews for each book
    reviews = [
        Review(book_id=books[0].id, reviewer_name="Alice", rating=5, comment="Must-read for every developer!"),
        Review(book_id=books[0].id, reviewer_name="Bob", rating=4, comment="Great insights, a bit dated in parts."),
        Review(book_id=books[1].id, reviewer_name="Charlie", rating=5, comment="Changed how I write code."),
        Review(book_id=books[1].id, reviewer_name="Dana", rating=4, comment="Very useful, but dense."),
        Review(book_id=books[1].id, reviewer_name="Eve", rating=5, comment="A must for clean code practices."),
        Review(book_id=books[2].id, reviewer_name="Frank", rating=5, comment="Life-changing productivity advice."),
        Review(book_id=books[2].id, reviewer_name="Grace", rating=4, comment="Good, but repetitive."),
    ]
    try:
        db.add_all(reviews)
        db.commit()
        print(f"Seed: Added {len(reviews)} reviews.")
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error inserting reviews: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
