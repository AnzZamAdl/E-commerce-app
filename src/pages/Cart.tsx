import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cart() {
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Failed to update quantity');
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove item');
    }
  });

  const handleUpdateQuantity = (itemId: string, currentQuantity: number, delta: number) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const total = cartItems?.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0) || 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
      {!cartItems?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
              <img
                src={item.product?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                alt={item.product?.name}
                className="h-16 w-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item.product?.name}</h3>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="mx-2 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-800 mt-2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link
              to="/payment"
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 inline-block text-center"
            >
              Proceed to Payment
            </Link>
          </div>
        </>
      )}
    </div>
  );
}