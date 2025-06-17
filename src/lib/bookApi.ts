import { API_BASE_URL } from './api';

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  published_year: number;
}

export interface Reaction {
  name: string;
  rating: number;
  emoji: string;
  comment: string;
  reading_status: string;
}

export interface Review {
  id: number;
  reader_id: number;
  book_id: number;
  reading_status: string;
  rating?: number;
  emoji?: string;
  comment?: string;
  reader_name?: string;
  name?: string;
}

class BookApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getBook(bookId: string | number): Promise<Book> {
    return this.fetchWithErrorHandling<Book>(`${API_BASE_URL}/books/${bookId}`);
  }

  async getBookReactions(bookId: string | number): Promise<Reaction[]> {
    return this.fetchWithErrorHandling<Reaction[]>(`${API_BASE_URL}/reviews/books/${bookId}/reactions`);
  }

  async getReaderReview(readerId: number, bookId: string | number): Promise<Review> {
    return this.fetchWithErrorHandling<Review>(`${API_BASE_URL}/reviews/readers/${readerId}/books/${bookId}`);
  }

  async startReading(readerId: number, bookId: string | number): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/reviews/start-reading`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readerId, bookId })
    });
  }

  async finishReading(
    readerId: number, 
    bookId: string | number, 
    rating: number, 
    emoji: string, 
    comment: string
  ): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/reviews/finish-reading`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readerId, bookId, rating, emoji, comment })
    });
  }
}

export const bookApiService = new BookApiService();