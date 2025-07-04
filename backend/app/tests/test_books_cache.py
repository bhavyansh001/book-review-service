import pytest
from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime
from app.routes import books
from app.utils.cache import cache
from app.config import settings

client = TestClient(app)

def test_list_books_cache_miss(monkeypatch):
    # Simulate DB returning a list of books
    class DummyBook:
        def __init__(self, id, title):
            self.id = id
            self.title = title
            self.author = "Author"
            self.isbn = "1234567890"
            self.description = "desc"
            self.publication_year = 2024
            self.created_at = datetime.utcnow()
            self.updated_at = None
    class DummyDB:
        def query(self, model):
            class DummyQuery:
                def offset(self, *args, **kwargs):
                    return self
                def limit(self, *args, **kwargs):
                    return self
                def all(self):
                    return [DummyBook(1, "Book 1"), DummyBook(2, "Book 2")]
            return DummyQuery()
    app.dependency_overrides[books.get_db] = lambda: DummyDB()
    monkeypatch.setattr(cache, "get", lambda key: None)
    response = client.get(f"{settings.API_V1_STR}/books")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["title"] == "Book 1"


def test_list_books_cache_hit(monkeypatch):
    # Simulate cache returning a list of books
    cached_books = [
        {"id": 1, "title": "Book 1", "author": "Author", "isbn": "1234567890", "description": "desc", "publication_year": 2024, "created_at": str(datetime.utcnow()), "updated_at": None},
        {"id": 2, "title": "Book 2", "author": "Author", "isbn": "1234567890", "description": "desc", "publication_year": 2024, "created_at": str(datetime.utcnow()), "updated_at": None}
    ]
    app.dependency_overrides[books.get_db] = lambda: None  # DB should not be called
    monkeypatch.setattr(cache, "get", lambda key: cached_books)
    response = client.get(f"{settings.API_V1_STR}/books")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["title"] == "Book 1"
