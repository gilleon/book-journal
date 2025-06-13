'use client';

import { useEffect, useState } from "react";
import ModalForm from "../../components/ModalForm";
import DataTable from "../../components/DataTable";
import FilterDropdown from "../../components/FilterDropdown";
import { API_BASE_URL } from "../../lib/api";

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

  const api = `${API_BASE_URL}/api/books`;

  const fetchBooks = () => {
    fetch(api)
      .then(res => res.json())
      .then(setBooks);
  };

  useEffect(() => {
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

  const handleEdit = (book: Book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      published_year: book.published_year.toString()
    });
    setUpdateMethod('PUT');
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`${api}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchBooks();
  };

  return (
    <>
      <div className="p-6 plant-list-section">
        <h1 className="text-3xl font-bold mb-4">Books</h1>

        <ModalForm
          title={editingId ? "Edit Book" : "Add Book"}
          show={showModal}
          onClose={() => {
            setFormData({ title: "", author: "", genre: "", published_year: "" });
            setEditingId(null);
            setShowModal(false);
            setUpdateMethod("PUT");
          }}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="number"
            name="published_year"
            placeholder="Year"
            value={formData.published_year}
            onChange={handleChange}
            className="border p-2"
            required
          />
          {editingId && (
            <div className="sm:col-span-2 flex items-center gap-4">
              <label>
                <input
                  type="radio"
                  name="updateMethod"
                  value="PUT"
                  checked={updateMethod === "PUT"}
                  onChange={() => setUpdateMethod("PUT")}
                />{" "}
                Full Update (PUT)
              </label>
              <label>
                <input
                  type="radio"
                  name="updateMethod"
                  value="PATCH"
                  checked={updateMethod === "PATCH"}
                  onChange={() => setUpdateMethod("PATCH")}
                />{" "}
                Partial Update (PATCH)
              </label>
            </div>
          )}
        </ModalForm>

        <FilterDropdown
          label="Filter by Genre:"
          options={[...new Set(books.map((book) => book.genre))]}
          value={filterGenre}
          onChange={setFilterGenre}
        />

        <DataTable
          data={books.filter((book) => !filterGenre || book.genre === filterGenre)}
          columns={[
            { header: "Title", accessor: "title" },
            { header: "Author", accessor: "author" },
            { header: "Genre", accessor: "genre" },
            { header: "Year", accessor: "published_year" },
          ]}
          actions={(book) => (
            <>
              <button
                onClick={() => {
                  handleEdit(book);
                  setShowModal(true);
                }}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDeleteId(book.id)}
                className="text-red-600 ml-2"
              >
                Delete
              </button>
            </>
          )}
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
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-green-700 text-white px-4 py-2 rounded add-plant-button"
      >
        ➕ Add New Book
      </button>
    </>
  );
}
