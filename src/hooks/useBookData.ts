import { useState, useEffect, useCallback } from 'react';
import { bookApiService, Book, Reaction, Review } from '@/lib/bookApi';
import { useCrudData } from './useCrudData';
import { API_BASE_URL } from '@/lib/api';

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

interface BookFormData {
  title: string;
  author: string;
  genre: string;
  published_year: string;
}

export function useBookData() {
  const [filterGenre, setFilterGenre] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updateMethod, setUpdateMethod] = useState<'PUT' | 'PATCH'>('PUT');
  const [readerId, setReaderId] = useState<number | null>(null);

  const {
    items: books,
    loading,
    error,
    formData,
    editingId,
    showModal,
    confirmDeleteId,
    isEditing,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleOpenAddModal,
    handleCloseModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    fetchItems: fetchBooks,
    clearError,
  } = useCrudData<Book, BookFormData>({
    endpoint: `${API_BASE_URL}/books`,
    initialFormData: {
      title: '',
      author: '',
      genre: '',
      published_year: ''
    },
    transformFormData: (data: BookFormData) => ({
      title: data.title,
      author: data.author,
      genre: data.genre,
      published_year: Number(data.published_year)
    })
  });

  useEffect(() => {
    const storedReader = localStorage.getItem("reader");
    if (storedReader) {
      const parsed = JSON.parse(storedReader);
      if (parsed && parsed.id) {
        setReaderId(parsed.id);
      }
    }
  }, []);

  const handleEditBook = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    const bookWithId = { ...book, id: book.id! } as Book;
    handleEdit(bookWithId);
    setShowDetailsModal(false);
    setSelectedBook(null);
  };

  const handleDeleteBook = async (id: number) => {
    await handleDelete(id);
  };

  const handleRowClick = (book: Book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBook(null);
  };

  const handleOpenDeleteModalBook = (e: React.MouseEvent, bookId: number) => {
    e.stopPropagation();
    handleOpenDeleteModal(bookId);
  };

  const getFilteredBooks = () => {
    return books.filter((book) => !filterGenre || book.genre === filterGenre);
  };

  const getGenres = () => {
    return [...new Set(books.map((book) => book.genre))];
  };

  const populateForm = (book: Book) => {
    const bookWithId = { ...book, id: book.id! } as Book;
    handleEdit(bookWithId);
    setUpdateMethod('PUT');
    setShowDetailsModal(false);
    setSelectedBook(null);
  };

  const resetForm = () => {
    handleCloseModal();
    setUpdateMethod('PUT');
  };

  return {
    books,
    loading,
    error,
    filteredBooks: getFilteredBooks(),
    genres: getGenres(),
    formData,
    editingId,
    updateMethod,
    isEditing,
    showModal,
    filterGenre,
    confirmDeleteId,
    selectedBook,
    showDetailsModal,
    readerId,
    handleChange,
    resetForm,
    populateForm,
    setUpdateMethod,
    handleSubmit,
    handleEdit: handleEditBook,
    handleDelete: handleDeleteBook,
    fetchBooks,
    handleRowClick,
    handleCloseModal,
    handleCloseDetailsModal,
    handleOpenAddModal,
    handleCloseDeleteModal,
    handleOpenDeleteModal: handleOpenDeleteModalBook,
    setFilterGenre,
    clearError,
  };
}