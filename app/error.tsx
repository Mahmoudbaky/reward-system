"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Something went wrong
        </h2>
        <p className="text-red-700 mb-6">
          We're sorry, but something went wrong. Our team has been notified
          about this issue.
        </p>
        <p className="text-gray-700 mb-6">
          You can try refreshing the page or going back to the previous page.
        </p>
        <button
          onClick={reset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
