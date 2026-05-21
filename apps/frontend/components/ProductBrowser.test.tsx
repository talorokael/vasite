import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProductBrowser from './ProductBrowser';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/lib/AuthContext';
import { SWRConfig } from 'swr';
import { describe, it, beforeAll, beforeEach, expect } from 'vitest';
// Mock API client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    getProducts: vi.fn().mockResolvedValue({ products: [] }),
    getCategories: vi.fn().mockResolvedValue([]),
  },
}));

// Mock SWR to return data immediately
const mockProducts = [
  { id: '1', name: 'Test Product', price: 1000, description: 'A test product', images: [], categoryId: null, categoryName: null, isAvailable: true, productType: 'FLOWER', sku: null, compareAtPrice: null, inventory: 10, weight: null, strainType: null, cbdContent: null, thcContent: null, size: null, tags: [], featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), userId: null },
];

vi.mock('swr', () => ({
  default: () => ({ data: mockProducts, error: null, isLoading: false }),
}));

describe('ProductBrowser', () => {
  it('renders products after loading', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <AuthProvider>
          <CartProvider>
            <ProductBrowser initialProducts={[]} categories={[]} />
          </CartProvider>
        </AuthProvider>
      </SWRConfig>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
});

//import { describe, it, beforeAll, beforeEach, expect } from 'vitest';