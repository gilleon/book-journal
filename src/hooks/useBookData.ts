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

interface BookFormState {
  title: string;
  author: string;
  genre: string;
  published_year: string;
}

export function useBookData() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<BookFormState>({
    title: '',
    author: '',
    genre: '',
    published_year: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updateMethod, setUpdateMethod] = useState<'PUT' | 'PATCH'>('PUT');

  const [showModal, setShowModal] = useState(false);
  const [filterGenre, setFilterGenre] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [readerId, setReaderId] = useState<number | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const booksData = await bookApiService.getAllBooks();
      setBooks(booksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedReader = localStorage.getItem("reader");
    if (storedReader) {
      const parsed = JSON.parse(storedReader);
      if (parsed && parsed.id) {
        setReaderId(parsed.id);
      }
    }
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', genre: '', published_year: '' });
    setEditingId(null);
    setShowModal(false);
    setUpdateMethod('PUT');
  };

  const populateForm = (book: Book) => {
    setEditingId(book.id!);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      published_year: book.published_year.toString()
    });
    setUpdateMethod('PUT');
    setShowModal(true);
    setShowDetailsModal(false);
    setSelectedBook(null);
  };

  // CRUD operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bookData: Book = {
        ...formData,
        published_year: Number(formData.published_year)
      };

      if (editingId) {
        // Update existing book
        if (updateMethod === 'PUT') {
          await bookApiService.updateBook(editingId, bookData);
        } else {
          await bookApiService.patchBook(editingId, bookData);
        }
      } else {
        // Create new book
        await bookApiService.createBook(bookData);
      }

      await fetchBooks(); // Refresh the books list
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
      console.error('Error saving book:', err);
    }
  };

  const handleEdit = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    populateForm(book);
  };

  const handleDelete = async (id: number) => {
    try {
      await bookApiService.deleteBook(id);
      await fetchBooks(); // Refresh the books list
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book');
      console.error('Error deleting book:', err);
    }
  };

  // UI handlers
  const handleRowClick = (book: Book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    resetForm();
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBook(null);
  };

  const handleOpenAddModal = () => {
    setShowModal(true);
  };

  const handleCloseDeleteModal = () => {
    setConfirmDeleteId(null);
  };

  const handleOpenDeleteModal = (e: React.MouseEvent, bookId: number) => {
    e.stopPropagation();
    setConfirmDeleteId(bookId);
  };

  // Utility functions
  const getFilteredBooks = () => {
    return books.filter((book) => !filterGenre || book.genre === filterGenre);
  };

  const getGenres = () => {
    return [...new Set(books.map((book) => book.genre))];
  };

  const clearError = () => {
    setError('');
  };

  const isEditing = editingId !== null;

  return {
    // Books data
    books,
    loading,
    error,
    filteredBooks: getFilteredBooks(),
    genres: getGenres(),

    // Form state
    formData,
    editingId,
    updateMethod,
    isEditing,

    // UI state
    showModal,
    filterGenre,
    confirmDeleteId,
    selectedBook,
    showDetailsModal,
    readerId,

    // Form handlers
    handleChange,
    resetForm,
    populateForm,
    setUpdateMethod,

    // CRUD operations
    handleSubmit,
    handleEdit,
    handleDelete,
    fetchBooks,

    // UI handlers
    handleRowClick,
    handleCloseModal,
    handleCloseDetailsModal,
    handleOpenAddModal,
    handleCloseDeleteModal,
    handleOpenDeleteModal,

    // Utility functions
    setFilterGenre,
    clearError,
  };
}