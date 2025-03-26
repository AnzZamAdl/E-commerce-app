import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from '../Cart';
import { renderWithProviders } from '../../test/utils';
import { useQuery, useMutation } from '@tanstack/react-query';

vi.mock('@tanstack/react-query');

const mockCartItems = [
  {
    id: '1',
    quantity: 2,
    product: {
      name: 'Test Product',
      price: 99.99,
      image_url: 'https://example.com/image.jpg',
    },
  },
];

describe('Cart', () => {
  it('renders loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    } as any);

    renderWithProviders(<Cart />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty cart message', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    } as any);

    renderWithProviders(<Cart />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('renders cart items and total', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockCartItems,
      isLoading: false,
    } as any);

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    } as any);

    renderWithProviders(<Cart />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$199.98')).toBeInTheDocument();
    expect(screen.getByText('Proceed to Payment')).toBeInTheDocument();
  });

  it('handles quantity updates', async () => {
    const mutateMock = vi.fn();
    vi.mocked(useQuery).mockReturnValue({
      data: mockCartItems,
      isLoading: false,
    } as any);

    vi.mocked(useMutation).mockReturnValue({
      mutate: mutateMock,
      isLoading: false,
    } as any);

    renderWithProviders(<Cart />);
    
    const increaseButton = screen.getByLabelText('Increase quantity');
    await userEvent.click(increaseButton);
    
    expect(mutateMock).toHaveBeenCalledWith({ itemId: '1', quantity: 3 });
  });
});