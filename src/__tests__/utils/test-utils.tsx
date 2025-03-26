import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithProviders(ui: ReactNode) {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            {ui}
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export const mockProducts = [
  {
    id: '1',
    name: 'Bamboo Water Bottle',
    price: 24.99,
    description: 'Sustainable bamboo water bottle',
    image_url: 'https://example.com/bottle.jpg',
    stock: 10,
  },
];

export const mockCartItems = [
  {
    id: '1',
    quantity: 2,
    product: mockProducts[0],
  },
];