// apps/frontend/components/ToastProvider.tsx
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return <Toaster position="bottom-right" reverseOrder={false} />;
}