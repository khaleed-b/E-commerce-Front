import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Plus, Minus, Loader, ShoppingBag } from 'lucide-react';
import api from '../lib/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get<Product>(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (isAdmin) {
      toast.error('Admin accounts cannot add items to cart');
      return;
    }

    if (product) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-slate-800 relative">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-48 h-48 text-blue-400 dark:text-blue-600" />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {product.category && (
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                {product.category}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-lg text-slate-600 dark:text-slate-400">
                {product.stock > 0 ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-medium">Out of stock</span>
                )}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Description</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.stock > 0 && user && !isAdmin && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </button>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
              </div>
            )}

            {product.stock === 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <p className="text-red-600 dark:text-red-400 font-semibold">
                  This product is currently out of stock
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
