import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, Shield, RotateCcw, Truck, Check } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { getCategoryArabicName } from '../services/api';

export default function ProductModal() {
  const { quickViewProduct, setQuickViewProduct } = useProducts();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorite = isInWishlist(product.id);
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'];

  const discountPrice = product.discountPercentage 
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-start justify-center min-h-screen py-8 sm:py-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-3xl glass-card rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl z-10 my-auto max-h-[90vh] overflow-y-auto text-right"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-5 left-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-850 overflow-hidden border border-slate-700/50 flex items-center justify-center p-4">
                <img
                  src={images[selectedImage] || images[0]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-black px-3 py-1 rounded-full shadow">
                    خصم {Math.round(product.discountPercentage)}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === idx ? 'border-indigo-500 shadow-glow' : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/50">
                    {getCategoryArabicName(product.category)}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-400 text-sm font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
                    <span className="text-slate-400 text-xs font-normal">(مراجعات موثوقة)</span>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white mt-3 leading-snug">
                  {product.title}
                </h2>

                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Stock Indicator */}
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-300 font-semibold">
                    متوفر في المخزون ({product.stock || 25} قطعة جاهزة للشحن)
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">السعر الحالي:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-indigo-400">
                      ${discountPrice || product.price}
                    </span>
                    {discountPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-medium">الكمية المطلوبة:</span>
                  <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-white text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold shadow-glow hover:shadow-glow-lg transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>إضافة للسلة (${((discountPrice || product.price) * quantity).toFixed(2)})</span>
                  </motion.button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isFavorite
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                    title="المفضلة"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Features Mini Bar */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-400 text-center border-t border-slate-800">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>شحن مجاني</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>ضمان سنتين</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-pink-400" />
                    <span>استرجاع 14 يوم</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
