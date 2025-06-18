"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalForm from "./ModalForm";
import InputField from "@/ui/InputField";
import SelectField from "@/ui/SelectField";
import TextAreaField from "@/ui/TextAreaField";
import Button from "@/ui/Button";
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
      <div className="space-y-4">
        <div>
          <p className="mb-1 text-gray-900 dark:text-gray-100">
            By {book.author}
          </p>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Genre: {book.genre} | Year: {book.published_year}
          </p>
        </div>

        {review && review.reading_status && (
          <p className="mb-2 text-sm text-green-600 dark:text-green-400">
            Current status: {review.reading_status} by{" "}
            {review.reader_name || review.name || "You"}
          </p>
        )}

        <Button
          onClick={handleStartReading}
          disabled={review?.reading_status === "In Progress"}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-1"
          variant="secondary"
        >
          I&apos;m Reading This
        </Button>

        {startFeedback && (
          <p className="text-sm text-green-700 dark:text-green-400">
            {startFeedback}
          </p>
        )}

        <InputField
          id="rating"
          label="Rating (1–5)"
          type="number"
          name="rating"
          value={rating.toString()}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full"
        />

        <SelectField
          id="emoji"
          label="Emoji"
          name="emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          options={[
            { value: "", label: "Select emoji" },
            { value: "😍", label: "😍 Love it" },
            { value: "😴", label: "😴 Boring" },
            { value: "🤯", label: "🤯 Mind-blown" },
          ]}
        />

        <TextAreaField
          id="comment"
          label="Notes"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this book..."
          rows={4}
        />

        {finishFeedback && (
          <p className="text-sm text-green-700 dark:text-green-400">
            {finishFeedback}
          </p>
        )}

        {reactions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Reactions from other readers:
            </h3>
            <ul className="space-y-4 max-h-60 overflow-y-auto">
              {reactions.map((reaction, index) => (
                <li
                  key={index}
                  className="border border-gray-200 p-3 rounded bg-gray-50"
                >
                  <p className="text-gray-900">
                    <strong>Reader:</strong> {reaction.name || "Anonymous"}
                  </p>
                  <p className="text-gray-900">
                    <strong>Status:</strong> {reaction.reading_status}
                  </p>
                  <p className="text-gray-900">
                    <strong>Emoji:</strong> {reaction.emoji}
                  </p>
                  <p className="text-gray-900">
                    <strong>Rating:</strong> {reaction.rating}
                  </p>
                  <p className="text-gray-90">
                    <strong>Comment:</strong> {reaction.comment}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/books/${book.id}/reactions`);
          }}
          className="bg-purple-500 text-white px-2 py-1 rounded mr-2"
          variant="purple"
          size="sm"
        >
          View Reactions
        </Button>
      </div>
    </ModalForm>
  );
}