import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Layout from '../../components/Layout';
import { renderWithProviders } from '../utils/test-utils';
import { useAuth } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext');
vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({ cartItemsCount: 2, isLoading: false }),
}));

describe('Layout Component', () => {
  it('renders navigation links correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithProviders(<Layout />);
    
    expect(screen.getByText('EcoShop')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('shows auth buttons when user is not logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithProviders(<Layout />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows user menu when logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@example.com' } as any,
      session: {} as any,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithProviders(<Layout />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('handles sign out correctly', async () => {
    const signOut = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@example.com' } as any,
      session: {} as any,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut,
    });

    renderWithProviders(<Layout />);
    
    const signOutButton = screen.getByText('Sign Out');
    await userEvent.click(signOutButton);
    
    expect(signOut).toHaveBeenCalled();
  });
});