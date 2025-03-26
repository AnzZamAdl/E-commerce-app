import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, Package, ClipboardList, Store, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, signOut } = useAuth();
  const { cartItemsCount } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Store className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">EcoShop</span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/products" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  <Package className="h-5 w-5 inline-block mr-1" />
                  Products
                </Link>
                {user && (
                  <Link to="/orders" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    <ClipboardList className="h-5 w-5 inline-block mr-1" />
                    Orders
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <Link to="/cart" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium relative">
                    <ShoppingCart className="h-5 w-5 inline-block" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <span className="text-sm text-gray-700">
                    <User className="h-4 w-4 inline-block mr-1" />
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign Out
                  </button>
                </>
              )}
              {!user && (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}