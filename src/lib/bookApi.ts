import { API_BASE_URL } from '@/lib/api';

export interface Book {
  id?: number;
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
  private baseUrl = `${API_BASE_URL}/books`;

  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getAllBooks(): Promise<Book[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  async getBookById(id: number): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch book: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching book:", error);
      throw error;
    }
  }

  async createBook(bookData: Book): Promise<Book> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create book: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  }

  async updateBook(id: number, bookData: Book): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update book: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  }

  async patchBook(id: number, bookData: Partial<Book>): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`Failed to patch book: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error patching book:", error);
      throw error;
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete book: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }

  async getBooksByGenre(genre: string): Promise<Book[]> {
    try {
      const response = await fetch(`${this.baseUrl}?genre=${encodeURIComponent(genre)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch books by genre: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching books by genre:", error);
      throw error;
    }
  }

  async getBook(bookId: string | number): Promise<Book> {
    return this.fetchWithErrorHandling<Book>(`${API_BASE_URL}/books/${bookId}`);
  }

  async getBookReactions(bookId: string | number): Promise<Reaction[]> {
    return this.fetchWithErrorHandling<Reaction[]>(
      `${API_BASE_URL}/reviews/books/${bookId}/reactions`
    );
  }

  async getReaderReview(readerId: number, bookId: string | number): Promise<Review> {
    return this.fetchWithErrorHandling<Review>(
      `${API_BASE_URL}/reviews/readers/${readerId}/books/${bookId}`
    );
  }

  async startReading(readerId: number, bookId: string | number): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/reviews/start-reading`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readerId, bookId }),
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readerId, bookId, rating, emoji, comment }),
    });
  }
}

export const bookApiService = new BookApiService();