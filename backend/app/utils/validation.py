import re
from typing import Optional

def validate_isbn(isbn: Optional[str]) -> bool:
    """Validate ISBN-10 or ISBN-13 format"""
    if not isbn:
        return True  # ISBN is optional
    
    # Remove hyphens and spaces
    isbn = re.sub(r'[-\s]', '', isbn)
    
    # Check length
    if len(isbn) not in [10, 13]:
        return False
    
    # Check if all characters are digits (except last char in ISBN-10 can be X)
    if len(isbn) == 10:
        return isbn[:-1].isdigit() and (isbn[-1].isdigit() or isbn[-1].upper() == 'X')
    else:  # ISBN-13
        return isbn.isdigit()

def validate_rating(rating: int) -> bool:
    """Validate rating is between 1 and 5"""
    return 1 <= rating <= 5

def validate_year(year: Optional[int]) -> bool:
    """Validate publication year is reasonable"""
    if year is None:
        return True
    return 1 <= year <= 2024