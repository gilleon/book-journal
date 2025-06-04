import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">Book Journal</h1>
      <p className="text-lg max-w-xl">
        Welcome to your personal Book Journal. Use this app to track your
        reading, add reflections, and discover book recommendations.
        <Link
          href="/books"
          className="hover:underline block"
        >
        Glance through our collection of book recommendations
        </Link>
      </p>
    </>
  );
}
