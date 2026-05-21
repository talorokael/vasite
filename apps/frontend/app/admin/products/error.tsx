// apps/frontend/app/products/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">We could not load the products. Please try again.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Try again
      </button>
    </div>
  );
}