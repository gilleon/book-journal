'use client';

import { useEffect, useState } from "react";
import ModalForm from "../../components/ModalForm";
import DataTable from "../../components/DataTable";
import FilterDropdown from "../../components/FilterDropdown";
import { API_BASE_URL } from "../../lib/api";
import BookDetailsModal from "../../components/BookDetailsModal";
import InputField from "../../ui/InputField";
import Button from "@/ui/Button";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  published_year: number;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    published_year: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterGenre, setFilterGenre] = useState('');
  const [updateMethod, setUpdateMethod] = useState<'PUT' | 'PATCH'>('PUT');
  // State for delete confirmation modal
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  // State for book details modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // State for readerId
  const [readerId, setReaderId] = useState<number | null>(null);

  const api = `${API_BASE_URL}/books`;

  const fetchBooks = () => {
    fetch(api)
      .then(res => res.json())
      .then(setBooks);
  };

  useEffect(() => {
    const storedReader = localStorage.getItem("reader");
    console.log("Raw localStorage value:", storedReader);
    
    if (storedReader) {
      const parsed = JSON.parse(storedReader);
      console.log("Parsed reader object:", parsed);
      
      // Now it should be a single reader object with an id property
      if (parsed && parsed.id) {
        setReaderId(parsed.id);
        console.log("Reader ID from localStorage:", parsed.id);
      } else {
        console.log("No valid reader ID found");
      }
    } else {
      console.log("No reader found in localStorage");
    }
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? updateMethod : 'POST';
    const endpoint = editingId ? `${api}/${editingId}` : api;

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, published_year: Number(formData.published_year) })
    });

    if (res.ok) {
      fetchBooks();
      setFormData({ title: '', author: '', genre: '', published_year: '' });
      setEditingId(null);
      setShowModal(false);
      setUpdateMethod('PUT');
    }
  };

  const handleEdit = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation(); // Prevent event bubbling
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      published_year: book.published_year.toString()
    });
    setUpdateMethod('PUT');
    setShowModal(true); // Show the edit modal, not the details modal
    
    // Ensure details modal is closed
    setShowDetailsModal(false);
    setSelectedBook(null);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`${api}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchBooks();
  };

  return (
    <>
      <div className="p-6 plant-list-section">
        <h1 className="text-3xl text-center font-bold mb-4">Books</h1>

        <ModalForm
          title={editingId ? "Edit Book" : "Add Book"}
          show={showModal}
          onClose={() => {
            setFormData({
              title: "",
              author: "",
              genre: "",
              published_year: "",
            });
            setEditingId(null);
            setShowModal(false);
            setUpdateMethod("PUT");
          }}
          onSubmit={handleSubmit}
        >
          <InputField
            id="title"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <InputField
            id="author"
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />

          <InputField
            id="genre"
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />

          <InputField
            id="published_year"
            label="Published Year"
            type="number"
            name="published_year"
            value={formData.published_year}
            onChange={handleChange}
            required
          />

          {editingId && (
            <InputField
              id="updateMethod"
              label="Update Method:"
              type="radio"
              name="updateMethod"
              value={updateMethod}
              onRadioChange={(value) => setUpdateMethod(value as 'PUT' | 'PATCH')}
              options={[
                { value: 'PUT', label: 'Full Update (PUT)' },
                { value: 'PATCH', label: 'Partial Update (PATCH)' }
              ]}
              className="pt-4 border-t border-gray-200 dark:border-gray-700"
            />
          )}
        </ModalForm>

        <FilterDropdown
          label="Filter by Genre:"
          options={[...new Set(books.map((book) => book.genre))]}
          value={filterGenre}
          onChange={setFilterGenre}
        />

        <DataTable
          data={books.filter(
            (book) => !filterGenre || book.genre === filterGenre
          )}
          columns={[
            {
              header: "Title",
              accessor: "title",
            },
            { header: "Author", accessor: "author" },
            { header: "Genre", accessor: "genre" },
            { header: "Year", accessor: "published_year" },
          ]}
          actions={(book) => (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(e, book);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                variant="primary"
                size="sm"
              >
                Edit
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(book.id);
                }}
                className="bg-red-500 text-white px-2 py-1 rounded"
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
            </>
          )}
          onRowClick={(book) => {
            setSelectedBook(book);
            setShowDetailsModal(true);
          }}
        />
        {/* Delete confirmation modal */}
        <ModalForm
          title="Confirm Delete"
          show={confirmDeleteId !== null}
          onClose={() => setConfirmDeleteId(null)}
          onSubmit={() => {
            if (confirmDeleteId !== null) handleDelete(confirmDeleteId);
            setConfirmDeleteId(null);
          }}
          confirmOnly
        >
          <p>Are you sure you want to delete this book?</p>
        </ModalForm>
      </div>
      <Button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-green-700 text-white px-4 py-2 rounded add-plant-button"
        variant="success"
        size="md"
      >
        ➕ Add New Book
      </Button>
      {/* Book Details Modal */}
      {showDetailsModal && selectedBook && readerId !== null && (
        <BookDetailsModal
          book={selectedBook}
          readerId={readerId}
          show={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBook(null);
          }}
        />
      )}
    </>
  );
}
