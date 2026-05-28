// apps/frontend/app/order/success/page.tsx
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  if (!reference) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="bg-card border border-destructive/20 rounded-lg p-8 text-center max-w-md">
          <p className="text-destructive font-medium">Invalid payment reference</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-8 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-4">
          Thank you for your order. We&apos;ll send you an email confirmation shortly.
        </p>

        <div className="bg-muted rounded-md p-3 mb-6">
          <p className="text-sm text-muted-foreground">Reference</p>
          <p className="font-mono text-sm text-foreground">{reference}</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/account/orders"
            className="block w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
