import pytest
from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime
from app.routes import books
from app.config import settings

client = TestClient(app)

# --- Unit Test: POST /api/v1/books ---
def test_create_book(monkeypatch):
    class DummyBook:
        def __init__(self, **kwargs):
            self.id = None
            self.title = kwargs.get("title")
            self.author = kwargs.get("author")
            self.isbn = kwargs.get("isbn")
            self.description = kwargs.get("description")
            self.publication_year = kwargs.get("publication_year")
            self.created_at = None
            self.updated_at = None
    def mock_commit():
        pass
    def mock_refresh(obj):
        obj.id = 1
        obj.created_at = datetime.utcnow()
    def mock_add(obj):
        pass
    class DummyDB:
        def query(self, model):
            class DummyQuery:
                def filter(self, *args, **kwargs):
                    return self
                def first(self):
                    return None
            return DummyQuery()
        def add(self, obj):
            mock_add(obj)
        def commit(self):
            mock_commit()
        def refresh(self, obj):
            mock_refresh(obj)
    app.dependency_overrides[books.get_db] = lambda: DummyDB()
    app.dependency_overrides[books.validate_isbn] = lambda isbn: True
    app.dependency_overrides[books.validate_year] = lambda year: True
    payload = {
        "title": "Test Book",
        "author": "Test Author",
        "isbn": "1234567890",
        "description": "desc",
        "publication_year": 2024
    }
    response = client.post(f"{settings.API_V1_STR}/books", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Book"
    assert data["author"] == "Test Author"
    assert "id" in data
    assert data["id"] == 1

# --- Unit Test: GET /api/v1/books/{id} ---
def test_get_book(monkeypatch):
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
    response = client.get(f"{settings.API_V1_STR}/books/1")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Book"
