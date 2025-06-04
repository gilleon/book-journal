'use client';

import { useEffect, useState, useRef } from "react";

type Book = {
  id: string | number;
  title: string;
  author: string;
  genre: string;
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const genreInput = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    fetch(
      "https://sd-6310-2025-summer-express-app.onrender.com/api/books/recommendations?genre=classic"
    )
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  const handleSearch = () => {
    const genre = genreInput.current?.value || "classic";
    fetch(
      `https://sd-6310-2025-summer-express-app.onrender.com/api/books/recommendations?genre=${genre}`
    )
      .then((res) => res.json())
      .then(setBooks);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-6 flex">
        <select ref={genreInput} className="border p-2 mr-2 text-black">
          <option value="classic">Classic</option>
          <option value="dystopian">Dystopian</option>
          <option value="romance">Romance</option>
          <option value="coming-of-age">Coming of Age</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-green-800 text-white px-4 py-2"
        >
          Search
        </button>
      </div>
      <h2 className="text-4xl font-bold mb-4">Book Recommendations</h2>
      <section className="plant-list-section">
        <table className="mt-6 w-full max-w-4xl border-collapse border border-gray-200 text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 font-semibold">
                Title
              </th>
              <th className="border border-gray-200 px-4 py-2 font-semibold">
                Author
              </th>
              <th className="border border-gray-200 px-4 py-2 font-semibold">
                Genre
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index}>
                <td className="border border-gray-200 px-4 py-2">
                  {book.title}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {book.author}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {book.genre}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
