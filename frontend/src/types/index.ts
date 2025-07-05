export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  publication_year?: number;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  book_id: number;
  reviewer_name: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  publication_year?: number;
}

export interface ReviewFormData {
  reviewer_name: string;
  rating: number;
  comment?: string;
}

export interface PaginationParams {
  skip: number;
  limit: number;
}
