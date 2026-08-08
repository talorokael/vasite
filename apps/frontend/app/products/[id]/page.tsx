import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import AddToCartButton from '@/components/AddToCartButton';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-dfc8.up.railway.app';
  let product;

  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error('Failed to fetch product');
    }
    product = await res.json();
  } catch {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {product.name}
          </h1>
          {product.categoryName && (
            <p className="text-sm text-muted-foreground mb-4">
              Category: {product.categoryName}
            </p>
          )}
          <p className="text-2xl font-bold text-primary mb-4">
            {formatPrice(product.price)}
          </p>
          {product.description && (
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              {product.description}
            </p>
          )}
          {product.productType && (
            <p className="text-sm text-muted-foreground mb-2">
              Type: {product.productType}
            </p>
          )}
          {product.strainType && (
            <p className="text-sm text-muted-foreground mb-2">
              Strain: {product.strainType}
            </p>
          )}
          <div className="mt-4">
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
