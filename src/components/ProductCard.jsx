import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { getCategoryArabicName } from '../services/api';

export default function ProductCard({ product, index }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { setQuickViewProduct } = useProducts();

  const isFavorite = isInWishlist(product.id);
  const discountPrice = product.discountPercentage 
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min((index % 8) * 0.08, 0.6) }}
      className="group relative flex flex-col rounded-3xl glass-card overflow-hidden border border-slate-700/60 hover:border-indigo-500/50 hover:shadow-glow transition-all duration-300"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-800/40 p-6 flex items-center justify-center">
        {/* Badges */}
        <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1.5 items-end">
          {product.isCustom && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow">
              منتج مضاف حديثاً ✨
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow">
              خصم {Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3.5 left-3.5 z-10 p-2.5 rounded-2xl backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
              : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title="إضافة للمفضلة"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
          alt={product.title}
          className="h-full w-full object-contain object-center transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuickViewProduct(product)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-bold border border-slate-600 shadow-xl hover:bg-indigo-600 transition-colors"
          >
            <Eye className="w-4 h-4 text-indigo-400 group-hover:text-white" />
            <span>نظرة سريعة</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 text-right">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <span className="text-indigo-400 font-semibold tracking-wide bg-indigo-950/50 px-2.5 py-0.5 rounded-lg border border-indigo-800/40">
            {getCategoryArabicName(product.category)}
          </span>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => setQuickViewProduct(product)}
          className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">
                ${discountPrice || product.price}
              </span>
              {discountPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${product.price}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-rose-400 font-semibold block mt-0.5">
                متبقي {product.stock} فقط!
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow transition-all"
            title="إضافة للسلة"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>أضف</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
