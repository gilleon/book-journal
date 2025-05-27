import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">Book Journal</h1>
      <p className="text-lg max-w-xl text-gray-700 dark:text-gray-300">
        Welcome to your personal Book Journal. Use this app to track your
        reading, add reflections, and discover book recommendations.
        <Link
          href="/books"
          className="text-blue-600 dark:text-blue-400 hover:underline block"
        >
        Glance through our collection of book recommendations
        </Link>
      </p>
      <footer className="row-start-3 text-sm text-gray-500">
        Built with Next.js · Summer 2025
      </footer>
    </>
  );
}
