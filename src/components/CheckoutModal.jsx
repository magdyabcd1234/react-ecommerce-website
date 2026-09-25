import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles,
  Lock,
  LogIn,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cartItems, totalAmount, clearCart, showToast } = useCart();
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '01012345678',
    city: 'القاهرة',
    address: 'شارع النصر، المعادي',
    paymentMethod: 'cod'
  });
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Auto populate name from logged in user
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setIsSuccess(true);

    // Save order in localStorage under orders list
    const newOrder = {
      id: generatedId,
      userEmail: user?.email || 'guest',
      userName: formData.name,
      phone: formData.phone,
      address: `${formData.city} - ${formData.address}`,
      items: cartItems,
      totalAmount: totalAmount,
      date: new Date().toISOString(),
      status: 'pending'
    };

    const savedOrders = localStorage.getItem('app_user_orders');
    const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
    ordersList.unshift(newOrder);
    localStorage.setItem('app_user_orders', JSON.stringify(ordersList));

    // Fire Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }

    // Clear cart
    clearCart();
    showToast(`تم تأكيد طلبك بنجاح برقم #${generatedId}`, 'success');
  };

  const handleQuickCustomerLogin = () => {
    const res = login('user@store.com', 'user123');
    if (res.success) {
      showToast('تم تسجيل الدخول بحساب العميل التجريبي! يمكنك الآن إتمام الطلب 🛍️', 'success');
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-start justify-center min-h-screen py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl glass-card rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl z-10 text-right overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleClose}
            className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shadow-glow">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">إتمام الطلب والشراء</h2>
                  <p className="text-xs text-slate-400">بيانات التوصيل والدفع الآمن</p>
                </div>
              </div>

              {/* Requirement: User MUST be logged in to buy! */}
              {!isAuthenticated ? (
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-center space-y-4 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-glow">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">يجب تسجيل الدخول لإتمام عملية الشراء</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                      حرصاً على أمان مشترياتك ومتابعة الشحنة والفواتير، يتطلب المتجر تسجيل الدخول بحسابك أو إنشاء حساب جديد قبل الشراء.
                    </p>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        navigate('/admin/login');
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>تسجيل الدخول / إنشاء حساب جديد</span>
                    </button>

                    <button
                      onClick={handleQuickCustomerLogin}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>دخول سريع كعميل تجريبي بنقرة ⚡</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Authenticated Customer Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Verified User Banner */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">حساب مسجل ومعتمد</span>
                        <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      جاهز للشراء ✓
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم بالكامل</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الهاتف</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">المدينة</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">عنوان التوصيل بالتفصيل</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">طريقة الدفع المفضلة</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod'
                          ? 'bg-indigo-950/60 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                          className="hidden"
                        />
                        <Banknote className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold">الدفع عند الاستلام</span>
                      </label>

                      <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'card'
                          ? 'bg-indigo-950/60 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === 'card'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                          className="hidden"
                        />
                        <CreditCard className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold">بطاقة بنكية / فيزا</span>
                      </label>
                    </div>
                  </div>

                  {/* Amount to pay */}
                  <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                    <span className="text-xs text-indigo-300 font-semibold">المبلغ المستحق للدفع:</span>
                    <span className="text-xl font-black text-white">${totalAmount.toFixed(2)}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-sm shadow-glow mt-4"
                  >
                    تأكيد وإرسال الطلب الآن 🚀
                  </motion.button>
                </form>
              )}
            </div>
          ) : (
            /* Success State */
            <div className="py-8 text-center space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40 shadow-glow"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-black text-white">تهانينا! تم تأكيد طلبك بنجاح</h3>
                <p className="text-slate-300 text-sm mt-2">
                  رقم تتبع طلبك هو: <span className="font-mono text-indigo-400 font-bold text-base">{orderId}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  تم ربط الطلب بحسابك ({user?.email}) وسيتم التواصل معك على الرقم ({formData.phone}).
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow"
                >
                  العودة للتسوق
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
