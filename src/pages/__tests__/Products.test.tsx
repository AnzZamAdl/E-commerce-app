import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Products from '../Products';
import { renderWithProviders } from '../../test/utils';
import { useQuery } from '@tanstack/react-query';

vi.mock('@tanstack/react-query');

const mockProducts = [
  {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    image_url: 'https://example.com/image.jpg',
    description: 'Test description',
    stock: 10,
  },
];

describe('Products', () => {
  it('renders loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderWithProviders(<Products />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders products list', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    } as any);

    renderWithProviders(<Products />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders empty state when no products', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    renderWithProviders(<Products />);
    
    expect(screen.getByText('Our Products')).toBeInTheDocument();
  });
});