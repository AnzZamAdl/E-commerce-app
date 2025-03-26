import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>
      {orders?.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet</p>
      ) : (
        <div className="space-y-8">
          {orders?.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order placed</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">${order.total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4 space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                      alt={item.product?.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-medium">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}