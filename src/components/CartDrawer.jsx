import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    shipping, 
    tax, 
    totalAmount,
    setIsCheckoutOpen,
    showToast
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NOVA20') {
      const discount = subtotal * 0.2;
      setPromoDiscount(discount);
      showToast('تم تطبيق كود الخصم (20% خصم)! 🎉', 'success');
    } else {
      showToast('كود الخصم غير صالح. جرب كود: NOVA20', 'error');
    }
  };

  const finalTotal = Math.max(0, totalAmount - promoDiscount);

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          {/* Drawer Panel */}
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
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">سلة المشتريات</h2>
                  <p className="text-xs text-slate-400">{cartItems.length} عناصر مضافة</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-right">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">سلة التسوق فارغة</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      استكشف منتجاتنا الرائعة وأضف ما يعجبك إلى السلة!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow"
                  >
                    ابدأ التسوق الآن
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs">
                    <span className="text-slate-400">المنتجات المختارة</span>
                    <button
                      onClick={clearCart}
                      className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      إفراغ السلة
                    </button>
                  </div>

                  {cartItems.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={item.id}
                      className="flex gap-4 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 relative group"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl bg-slate-800 p-1 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={item.thumbnail || (item.images && item.images[0])}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {item.title}
                          </h4>
                          <span className="text-indigo-400 text-xs font-bold mt-1 block">
                            ${(item.price * (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Promo code form */}
                  <form onSubmit={handleApplyPromo} className="pt-2">
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                      هل لديك كود خصم؟
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="جرب كود: NOVA20"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-slate-800/80 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white rounded-xl transition-all"
                      >
                        تطبيق
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-800 bg-slate-900/90 text-right space-y-4">
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-pink-400 font-medium">
                      <span>خصم الكوبون:</span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>رسوم الشحن:</span>
                    <span className="text-white font-medium">
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-bold">مجاني 🚚</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>ضريبة القيمة المضافة (5%):</span>
                    <span className="text-white font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-slate-800 text-base font-bold text-white">
                    <span>الإجمالي النهائي:</span>
                    <span className="text-indigo-400 text-lg font-black">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 text-white font-bold text-sm shadow-glow hover:shadow-glow-lg transition-all"
                >
                  <span>متابعة إتمام الطلب</span>
                  <ArrowLeft className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
