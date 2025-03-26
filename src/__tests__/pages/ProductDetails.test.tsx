import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDetails from '../../pages/ProductDetails';
import { renderWithProviders, mockProducts } from '../utils/test-utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

vi.mock('@tanstack/react-query');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe('ProductDetails Page', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
  });

  it('renders loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    } as any);

    renderWithProviders(<ProductDetails />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders product details', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockProducts[0],
      isLoading: false,
    } as any);

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    } as any);

    renderWithProviders(<ProductDetails />);
    
    expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProducts[0].price}`)).toBeInTheDocument();
    expect(screen.getByText(mockProducts[0].description)).toBeInTheDocument();
  });

  it('handles add to cart', async () => {
    const mutateMock = vi.fn();
    vi.mocked(useQuery).mockReturnValue({
      data: mockProducts[0],
      isLoading: false,
    } as any);

    vi.mocked(useMutation).mockReturnValue({
      mutateAsync: mutateMock,
      isLoading: false,
    } as any);

    renderWithProviders(<ProductDetails />);
    
    const addToCartButton = screen.getByText('Add to Cart');
    await userEvent.click(addToCartButton);
    
    expect(mutateMock).toHaveBeenCalled();
  });
});