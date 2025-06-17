import { useState, useEffect, useCallback } from 'react';
import { bookApiService, Book, Reaction, Review } from '@/lib/bookApi';

export function useBook(bookId: string | number) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookData = await bookApiService.getBook(bookId);
        setBook(bookData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  return { book, loading, error };
}

export function useBookReactions(bookId: string | number) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reactionsData = await bookApiService.getBookReactions(bookId);
      setReactions(reactionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reactions');
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (bookId) {
      fetchReactions();
    }
  }, [bookId, fetchReactions]);

  return { reactions, loading, error, refetch: fetchReactions };
}

export function useReaderReview(readerId: number, bookId: string | number) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewData = await bookApiService.getReaderReview(readerId, bookId);
      setReview(reviewData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch review');
    } finally {
      setLoading(false);
    }
  }, [readerId, bookId]);

  useEffect(() => {
    if (readerId && bookId) {
      fetchReview();
    }
  }, [readerId, bookId, fetchReview]);

  return { review, loading, error, refetch: fetchReview };
}