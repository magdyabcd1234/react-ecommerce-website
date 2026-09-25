import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function WishlistDrawer() {
  const { 
    wishlistItems, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    toggleWishlist, 
    addToCart,
    showToast
  } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsWishlistOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md glass-dropdown border-l border-slate-700/60 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between text-right">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">قائمة المفضلة</h2>
                  <p className="text-xs text-slate-400">{wishlistItems.length} منتجات محفوظة</p>
                </div>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-right">
              {wishlistItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                    <Heart className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">لا توجد منتجات بالمفضلة</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      اضغط على رمز القلب في بطاقة أي منتج لحفظه والرجوع إليه لاحقاً.
                    </p>
                  </div>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="flex gap-4 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-800 p-1 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={item.thumbnail || (item.images && item.images[0])}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-indigo-400 text-sm font-black">
                          ${item.price}
                        </span>

                        <button
                          onClick={() => {
                            addToCart(item, 1);
                            toggleWishlist(item);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>نقل للسلة</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/90 text-center">
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                متابعة التسوق
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
