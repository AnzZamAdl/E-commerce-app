import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Products from '../../pages/Products';
import { renderWithProviders, mockProducts } from '../utils/test-utils';
import { useQuery } from '@tanstack/react-query';

vi.mock('@tanstack/react-query');

describe('Products Page', () => {
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
    
    expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProducts[0].price}`)).toBeInTheDocument();
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