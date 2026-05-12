'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  if (!reference) {
    return <div className="p-8 text-center text-red-600">Invalid payment reference</div>;
  }

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <h1 className="text-2xl font-bold text-green-600">Payment successful! 🎉</h1>
      <p className="mt-2">Thank you for your order.</p>
      <p className="text-sm text-gray-500 mt-1">Reference: {reference}</p>
      <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}