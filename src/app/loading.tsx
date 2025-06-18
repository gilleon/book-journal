export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <div className="ml-4 text-xl text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    </div>
  );
}