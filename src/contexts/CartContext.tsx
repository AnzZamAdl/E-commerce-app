import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

type CartContextType = {
  cartItemsCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType>({
  cartItemsCount: 0,
  isLoading: false,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
  });

  const cartItemsCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cartItemsCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);