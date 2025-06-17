"use client";

import { useEffect, useState, Suspense } from "react";
import { API_BASE_URL } from "../../lib/api";
import { useSearchParams } from "next/navigation";

interface Reaction {
  name: string;
  reading_status: string;
  emoji: string;
  rating: number;
  comment: string;
}

function BookReactionsContent() {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [bookTitle, setBookTitle] = useState<string>("");
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");

  useEffect(() => {
    if (!bookId) return;

    fetch(`${API_BASE_URL}/reviews/books/${bookId}/reactions`)
      .then((res) => res.json())
      .then((data) => setReactions(data))
      .catch((err) => console.error("Error fetching reactions:", err));

    fetch(`${API_BASE_URL}/books/${bookId}`)
      .then((res) => res.json())
      .then((data) => setBookTitle(data.title))
      .catch((err) => console.error("Error fetching book title:", err));
  }, [bookId]);

  if (!bookId) return <p className="text-center mt-4">No book selected.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reactions for: {bookTitle}</h1>

      {reactions.length === 0 ? (
        <p className="text-gray-600">No reactions yet for this book.</p>
      ) : (
        <ul className="space-y-4">
          {reactions.map((reaction, index) => (
            <li key={index} className="border p-4 rounded shadow">
              <p>
                <strong>Reader:</strong> {reaction.name || "Anonymous"}
              </p>
              <p>
                <strong>Status:</strong> {reaction.reading_status}
              </p>
              <p>
                <strong>Rating:</strong> {reaction.rating} ⭐
              </p>
              <p>
                <strong>Emoji:</strong> {reaction.emoji}
              </p>
              {reaction.comment && (
                <p>
                  <strong>Comment:</strong> &apos;{reaction.comment}&apos;
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function BookReactionsPage() {
  return (
    <Suspense fallback={<div className="text-center mt-4">Loading...</div>}>
      <BookReactionsContent />
    </Suspense>
  );
}
