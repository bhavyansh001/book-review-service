import pytest
from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime
from app.routes import books
from app.utils.cache import cache
from app.config import settings

client = TestClient(app)

# --- Integration Test: Cache Miss Path for GET /api/v1/books/{id} ---
def test_get_book_cache_miss(monkeypatch):
    from app.schemas.book import BookResponse
    class DummyBook:
        id = 1
        title = "Test Book"
        author = "Test Author"
        isbn = "1234567890"
        description = "desc"
        publication_year = 2024
        created_at = datetime.utcnow()
        updated_at = None
    class DummyDB:
        def query(self, model):
            class DummyQuery:
                def filter(self, *args, **kwargs):
                    return self
                def first(self):
                    return DummyBook()
            return DummyQuery()
    app.dependency_overrides[books.get_db] = lambda: DummyDB()
    monkeypatch.setattr(cache, "get", lambda key: None)
    response = client.get(f"{settings.API_V1_STR}/books/1")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Book"
