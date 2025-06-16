"use client";

import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../lib/api";

interface Review {
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

interface Reaction {
  id: number;
  reader_id: number;
  book_id: number;
  name: string;
  reading_status: string;
  emoji: string;
  rating: number;
  comment: string;
}

interface BookDetailsModalProps {
  book: {
    id: number;
    title: string;
    author: string;
    genre: string;
    published_year: number;
  };
  readerId: number;
  onClose: () => void;
  show: boolean;
}

export default function BookDetailsModal({ book, readerId, onClose, show }: BookDetailsModalProps) {
  const [review, setReview] = useState<Review | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [emoji, setEmoji] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [startFeedback, setStartFeedback] = useState<string>("");
  const [finishFeedback, setFinishFeedback] = useState<string>("");
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const fetchReview = useCallback(() => {
    fetch(`${API_BASE_URL}/reviews/readers/${readerId}/books/${book.id}`)
      .then((res) => res.json())
      .then((data: Review) => setReview(data))
      .catch((error) => console.error("Error fetching review:", error));
  }, [readerId, book.id]);

  const fetchReactions = useCallback(() => {
    fetch(`${API_BASE_URL}/reviews/books/${book.id}/reactions`)
      .then((res) => res.json())
      .then((data: Reaction[]) => setReactions(data))
      .catch((error) => console.error("Error fetching reactions:", error));
  }, [book.id]);

  useEffect(() => {
    if (show) {
      fetchReview();
      fetchReactions();
    }
  }, [show, fetchReview, fetchReactions]);

  const handleStartReading = async () => {
    try {
      await fetch(`${API_BASE_URL}/reviews/start-reading`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readerId: readerId, bookId: book.id })
      });
      fetchReview();
      setReview((prevReview: Review | null) => ({
        ...prevReview,
        reading_status: "In Progress"
      } as Review));
      setStartFeedback("Status updated to In Progress");
      setFinishFeedback("");
    } catch (error) {
      console.error("Error starting reading:", error);
    }
  };

  const handleFinishReading = async () => {
    try {
      await fetch(`${API_BASE_URL}/reviews/finish-reading`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId: readerId,
          bookId: book.id,
          rating: rating,
          emoji: emoji,
          comment: comment
        })
      });
      fetchReview();
      setReview((prevReview: Review | null) => ({
        ...prevReview,
        reading_status: "Finished"
      } as Review));
      setFinishFeedback("Status updated to Finished");
      setStartFeedback("");
    } catch (error) {
      console.error("Error finishing reading:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
        <p className="mb-1">By {book.author}</p>
        <p className="mb-3 text-sm text-gray-600">Genre: {book.genre} | Year: {book.published_year}</p>

        {review && review.reading_status && (
          <p className="mb-2 text-sm text-green-600">Current status: {review.reading_status} by {review.reader_name || review.name || "You"}</p>
        )}

        <button
          onClick={handleStartReading}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-1"
        >
          I&apos;m Reading This
        </button>
        {startFeedback && <p className="text-sm text-green-700 mb-2">{startFeedback}</p>}

        <div className="mb-2">
          <label className="block">Rating (1–5):</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min={1}
            max={5}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block">Emoji:</label>
          <select value={emoji} onChange={(e) => setEmoji(e.target.value)} className="border p-1 w-full">
            <option value="">Select emoji</option>
            <option value="😍">😍</option>
            <option value="😴">😴</option>
            <option value="🤯">🤯</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Notes:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-1 w-full"
          />
        </div>

        <button
          onClick={handleFinishReading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          I Finished It!
        </button>
        {finishFeedback && <p className="text-sm text-green-700 mt-1 mb-2">{finishFeedback}</p>}

        <button
          onClick={onClose}
          className="mt-4 block w-full text-center text-gray-500"
        >
          Cancel
        </button>

        {reactions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Reactions from other readers:</h3>
            <ul className="space-y-4 max-h-60 overflow-y-auto">
              {reactions.map((reaction, index) => (
                <li key={index} className="border p-3 rounded">
                  <p><strong>Reader:</strong> {reaction.name || "Anonymous"}</p>
                  <p><strong>Status:</strong> {reaction.reading_status}</p>
                  <p><strong>Emoji:</strong> {reaction.emoji}</p>
                  <p><strong>Rating:</strong> {reaction.rating}</p>
                  <p><strong>Comment:</strong> {reaction.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}