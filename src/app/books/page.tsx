'use client';

import { useEffect, useState } from "react";

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

  const api = 'https://sd-6310-2025-summer-express-app.onrender.com/api/books';

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
    const method = editingId ? 'PUT' : 'POST';
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
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`${api}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchBooks();
  };

  return (
    <>
      <div className="p-6 plant-list-section">
        <h1 className="text-3xl font-bold mb-4">Books</h1>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? "Edit Book" : "Add Book"}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid gap-4 grid-cols-1 sm:grid-cols-2"
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
                <div className="sm:col-span-2 flex justify-end space-x-2">
                  <button
                    type="submit"
                    className="bg-green-800 text-white px-4 py-2 rounded"
                  >
                    {editingId ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        title: "",
                        author: "",
                        genre: "",
                        published_year: "",
                      });
                      setEditingId(null);
                      setShowModal(false);
                    }}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Author</th>
              <th className="border px-4 py-2">Genre</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.author}</td>
                <td className="border px-4 py-2">{book.genre}</td>
                <td className="border px-4 py-2">{book.published_year}</td>
                <td className="border px-4 py-2 space-x-2">
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
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
