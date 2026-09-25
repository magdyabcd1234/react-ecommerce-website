import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  KeyRound, 
  UserPlus, 
  LogIn, 
  Eye, 
  EyeOff,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function AdminLogin() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' or 'customer'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register, authError, setAuthError } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      let result;
      if (isRegisterMode) {
        if (password.length < 6) {
          setAuthError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
          setLoading(false);
          return;
        }
        result = register({ name, email, password, role });
        if (result.success) {
          showToast(`تم إنشاء حسابك بنجاح (${result.user.name})! مرحباً بك 🚀`, 'success');
          if (role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      } else {
        result = login(email, password);
        if (result.success) {
          showToast(`أهلاً بك مجدداً، ${result.user.name}! 👋`, 'success');
          if (result.user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      }
      setLoading(false);
    }, 400);
  };

  const handleFillDemoAdmin = () => {
    setIsRegisterMode(false);
    setEmail('admin@store.com');
    setPassword('admin123');
    setAuthError('');
  };

  const handleFillDemoCustomer = () => {
    setIsRegisterMode(false);
    setEmail('user@store.com');
    setPassword('user123');
    setAuthError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden text-right">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center mx-auto shadow-glow">
            {isRegisterMode ? <UserPlus className="w-7 h-7 text-white" /> : <ShieldCheck className="w-7 h-7 text-white" />}
          </div>
          <h2 className="text-2xl font-black text-white">
            {isRegisterMode ? 'إنشاء حساب جديد' : 'بوابة تسجيل الدخول'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegisterMode 
              ? 'أنشئ حساب مدير لإدارة المتجر أو حساب عميل لمتابعة طلباتك' 
              : 'سجل دخولك للوصول للوحة التحكم وإدارة المنتجات والمشتريات'}
          </p>
        </div>

        {/* Mode Toggle Switch (Login vs Register) */}
        <div className="flex rounded-2xl bg-slate-900/80 p-1 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setAuthError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              !isRegisterMode 
                ? 'bg-indigo-600 text-white shadow-glow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setAuthError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              isRegisterMode 
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-glow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>إنشاء حساب جديد</span>
          </button>
        </div>

        {/* Demo Fast Logins (Shown in Login mode) */}
        {!isRegisterMode && (
          <div className="mb-5 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-indigo-300 flex items-center gap-1 text-[11px]">
              <KeyRound className="w-3.5 h-3.5 text-pink-400" />
              حسابات تجريبية جاهزة للاختبار الفوري:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-400 text-slate-200 hover:text-white text-[10px] font-bold transition-all text-center"
              >
                حساب مدير 🛡️
              </button>
              <button
                type="button"
                onClick={handleFillDemoCustomer}
                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-pink-600 border border-slate-700 hover:border-pink-400 text-slate-200 hover:text-white text-[10px] font-bold transition-all text-center"
              >
                حساب عميل 🛍️
              </button>
            </div>
          </div>
        )}

        {/* Error notification */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-5 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs leading-relaxed"
          >
            {authError}
          </motion.div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name field (Only in Register mode) */}
          {isRegisterMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الاسم بالكامل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محمد خالد"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </motion.div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              البريد الإلكتروني *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              كلمة المرور *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegisterMode ? '6 أحرف على الأقل' : '••••••••'}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-10 pl-11 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white absolute left-3.5 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role selector in Register mode */}
          {isRegisterMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-1"
            >
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                نوع الحساب الصلاحيات:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  role === 'admin'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                    className="hidden"
                  />
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold">مدير (داشبورد)</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  role === 'customer'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                    className="hidden"
                  />
                  <ShoppingBag className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold">عميل متجر</span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-sm shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                {isRegisterMode ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{isRegisterMode ? 'تأكيد التسجيل والدخول' : 'تسجيل الدخول'}</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← العودة إلى المتجر الرئيسي
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
