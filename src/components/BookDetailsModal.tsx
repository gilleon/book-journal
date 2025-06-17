"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalForm from "./ModalForm";
import { bookApiService } from "@/lib/bookApi";
import { useBookReactions, useReaderReview } from "@/hooks/useBookData";

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
  const router = useRouter();
  
  // Use custom hooks
  const { review, refetch: refetchReview } = useReaderReview(readerId, book.id);
  const { reactions, refetch: refetchReactions } = useBookReactions(book.id);
  
  // Local state
  const [rating, setRating] = useState<number>(5);
  const [emoji, setEmoji] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [startFeedback, setStartFeedback] = useState<string>("");
  const [finishFeedback, setFinishFeedback] = useState<string>("");

  const handleStartReading = async () => {
    try {
      await bookApiService.startReading(readerId, book.id);
      await refetchReview();
      setStartFeedback("Status updated to In Progress");
      setFinishFeedback("");
    } catch (error) {
      console.error("Error starting reading:", error);
    }
  };

  const handleFinishReading = async () => {
    try {
      await bookApiService.finishReading(readerId, book.id, rating, emoji, comment);
      await refetchReview();
      await refetchReactions();
      setFinishFeedback("Status updated to Finished");
      setStartFeedback("");
    } catch (error) {
      console.error("Error finishing reading:", error);
    }
  };

  if (!show) return null;

  return (
    <ModalForm
      title={book.title}
      show={show}
      onClose={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        handleFinishReading();
      }}
      submitLabel="I Finished It"
    >
      <p className="mb-1">By {book.author}</p>
      <p className="mb-3 text-sm text-gray-600">
        Genre: {book.genre} | Year: {book.published_year}
      </p>
      
      {review && review.reading_status && (
        <p className="mb-2 text-sm text-green-600">
          Current status: {review.reading_status} by{" "}
          {review.reader_name || review.name || "You"}
        </p>
      )}
      
      <button
        type="button"
        onClick={handleStartReading}
        disabled={review?.reading_status === "In Progress"}
        className={`bg-blue-600 text-white px-4 py-2 rounded mb-1 ${
          review?.reading_status === "In Progress"
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        I&apos;m Reading This
      </button>
      
      {startFeedback && (
        <p className="text-sm text-green-700 mb-2">{startFeedback}</p>
      )}
      
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
      
      {finishFeedback && (
        <p className="text-sm text-green-700 mb-2">{finishFeedback}</p>
      )}
      
      {reactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">
            Reactions from other readers:
          </h3>
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
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/books/${book.id}/reactions`);
        }}
        className="bg-purple-500 text-white px-2 py-1 rounded mr-2"
      >
        View Reactions
      </button>
    </ModalForm>
  );
}