// apps/frontend/components/EmptyState.tsx
import Link from 'next/link';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function EmptyState({
  title,
  description,
  ctaText,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        {description}
      </p>
      {ctaText && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {ctaText}
        </Link>
      )}
    </div>
  );
}
