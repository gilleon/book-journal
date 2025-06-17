"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../lib/api"; // Adjusted import path

interface Reaction {
  name: string;
  rating: number;
  emoji: string;
  comment: string;
  reading_status: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  published_year: number;
}

export default function BookReactionsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string; // Changed from bookId to id
  
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch book details
        const bookResponse = await fetch(`${API_BASE_URL}/books/${bookId}`);
        if (!bookResponse.ok) {
          throw new Error('Failed to fetch book details');
        }
        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch reactions
        const reactionsResponse = await fetch(`${API_BASE_URL}/reviews/books/${bookId}/reactions`);
        if (!reactionsResponse.ok) {
          throw new Error('Failed to fetch reactions');
        }
        const reactionsData = await reactionsResponse.json();
        setReactions(reactionsData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchData();
    }
  }, [bookId]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Finished':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Want to Read':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading reactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Books
        </button>
        
        {book && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-1">by {book.author}</p>
            <p className="text-sm text-gray-500">
              {book.genre} • Published {book.published_year}
            </p>
          </div>
        )}
      </div>

      {/* Reactions Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Reader Reactions ({reactions.length})
        </h2>
        
        {reactions.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              No reactions yet for this book.
            </p>
            <p className="text-gray-400 mt-2">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reactions.map((reaction, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                {/* Reader Info */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{reaction.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      reaction.reading_status
                    )}`}
                  >
                    {reaction.reading_status}
                  </span>
                </div>

                {/* Rating and Emoji */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {renderStars(reaction.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({reaction.rating}/5)
                    </span>
                  </div>
                  {reaction.emoji && (
                    <span className="text-2xl">{reaction.emoji}</span>
                  )}
                </div>

                {/* Comment */}
                {reaction.comment && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700 italic">
                      &ldquo;{reaction.comment}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {reactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {reactions.length}
              </p>
              <p className="text-sm text-gray-600">Total Reactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {reactions.filter(r => r.reading_status === 'Finished').length}
              </p>
              <p className="text-sm text-gray-600">Finished</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {reactions.filter(r => r.reading_status === 'In Progress').length}
              </p>
              <p className="text-sm text-gray-600">Reading</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {reactions.length > 0 
                  ? (reactions.reduce((sum, r) => sum + r.rating, 0) / reactions.length).toFixed(1)
                  : '0'
                }
              </p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}