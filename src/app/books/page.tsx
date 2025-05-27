'use client';

import { useEffect, useState, useRef } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const genreInput = useRef(null);

  useEffect(() => {
    fetch(
      "https://sd-6310-2025-summer-express-app.onrender.com/api/books/recommendations?genre=classic"
    )
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  const handleSearch = () => {
    const genre = genreInput.current.value;
    fetch(
      `https://sd-6310-2025-summer-express-app.onrender.com/api/books/recommendations?genre=${genre}`
    )
      .then((res) => res.json())
      .then(setBooks);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Book Recommendations</h1>
      <select ref={genreInput} className="border p-2 mr-2 text-black">
        <option value="classic">Classic</option>
        <option value="dystopian">Dystopian</option>
        <option value="romance">Romance</option>
        <option value="coming-of-age">Coming of Age</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Search
      </button>
      <ul className="mt-4">
        {books.map((book) => (
          <li key={book.id} className="border-b py-2">
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
