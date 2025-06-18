import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Book Journal
      </h1>
      <p className="text-lg max-w-xl text-gray-700 dark:text-gray-300 leading-relaxed">
        Welcome to your personal Book Journal. Use this app to track your
        reading, add reflections, and discover book recommendations.
      </p>
      <Link
        href="/books"
        className="inline-block mt-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium transition-colors duration-200"
      >
        Glance through our collection of book recommendations →
      </Link>
    </div>
  );
}
