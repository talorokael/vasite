// apps/frontend/components/ProductCard.tsx
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    productType?: string;
    strainType?: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            {product.productType && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {product.productType}
              </span>
            )}
          </div>
          <p className="text-green-600 font-bold text-xl">
            ${(product.price / 100).toFixed(2)}
          </p>
        </div>
        
        {product.description && (
          <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
        )}
        
        {product.strainType && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Strain:</span>
            <span className="ml-1 text-sm">{product.strainType}</span>
          </div>
        )}
        
        <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}