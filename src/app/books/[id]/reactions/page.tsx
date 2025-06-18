"use client";

import { useParams, useRouter } from "next/navigation";
import { useBook, useBookReactions } from "@/hooks/useBookData";
import Button from "@/ui/Button";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export default function BookReactionsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  
  // Use custom hooks
  const { book, loading: bookLoading, error: bookError } = useBook(bookId);
  const { reactions, loading: reactionsLoading, error: reactionsError } = useBookReactions(bookId);
  
  const loading = bookLoading || reactionsLoading;
  const error = bookError || reactionsError;

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

  // Prepare data for visualizations
  const statusData = reactions.length > 0 ? [
    { 
      name: 'Finished', 
      value: reactions.filter(r => r.reading_status === 'Finished').length,
      color: '#10B981'
    },
    { 
      name: 'In Progress', 
      value: reactions.filter(r => r.reading_status === 'In Progress').length,
      color: '#3B82F6'
    },
    { 
      name: 'Want to Read', 
      value: reactions.filter(r => r.reading_status === 'Want to Read').length,
      color: '#F59E0B'
    }
  ].filter(item => item.value > 0) : [];

  const avgRating = reactions.length > 0 
    ? (reactions.reduce((sum, r) => sum + r.rating, 0) / reactions.length).toFixed(1)
    : '0';

  if (loading) {
    return <LoadingSpinner message="Loading reactions..." />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="primary"
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => router.back()}
          variant="secondary"
          size="sm"
          className="flex mb-4 dark:text-blue-600 text-left"
        >
          ← Back to Books
        </Button>

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
        <div className="bg-white rounded-lg shadow-md mb-6 p-6">
          <h3 className="text-xl font-semibold mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {reactions.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Reactions</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {
                  reactions.filter((r) => r.reading_status === "Finished")
                    .length
                }
              </p>
              <p className="text-sm text-gray-600 mt-1">Finished</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {
                  reactions.filter((r) => r.reading_status === "In Progress")
                    .length
                }
              </p>
              <p className="text-sm text-gray-600 mt-1">Currently Reading</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">
                {avgRating}⭐
              </p>
              <p className="text-sm text-gray-600 mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      )}

      {/* Visualizations Section */}
      {reactions.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            {/* Reading Status Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold mb-4">
                Reading Status Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}