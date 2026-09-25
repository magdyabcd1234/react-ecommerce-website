import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ShieldCheck, Zap, Truck, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroBanner({ scrollToProducts }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-right"
          >
            {/* Top Pill Badge */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-indigo-300 text-sm font-medium shadow-glow"
            >
              <Sparkles className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>المتجر الأحدث مع لوحة تحكم ذكية متكاملة</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight lg:leading-[1.2]">
              تجربة تسوق فريدة <br />
              <span className="bg-gradient-to-l from-indigo-400 via-pink-400 to-indigo-200 bg-clip-text text-transparent">
                بأحدث التقنيات وأسرع أداء
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              اكتشف تشكيلة واسعة من أحدث الأجهزة الذكية، الأزياء، ومستلزمات الحياة العصرية. منتجات متجددة مباشرة من الـ API مع نظام إدارة متكامل لإضافة وتعديل المنتجات لحظياً.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToProducts}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 text-white font-bold text-base shadow-glow hover:shadow-glow-lg transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>تصفح المنتجات الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>

              <Link to="/admin">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2.5 px-6 py-4 rounded-2xl glass hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-base border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>دخول لوحة التحكم</span>
                </motion.div>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-right">
                <Truck className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">شحن سريع</h4>
                  <p className="text-[11px] text-slate-400">لجميع المحافظات</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-right">
                <Zap className="w-5 h-5 text-pink-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">تحديث فوري</h4>
                  <p className="text-[11px] text-slate-400">عبر الـ API المباشر</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-right">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">دفع آمن</h4>
                  <p className="text-[11px] text-slate-400">ضمان 100%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual Showcase Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md">
              
              {/* Main Display Image */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl glass-card group">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="NovaStore Hero Product"
                  className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                {/* Overlay details */}
                <div className="absolute bottom-6 right-6 left-6 text-right">
                  <span className="inline-block px-3 py-1 bg-pink-500/90 text-white text-xs font-bold rounded-lg mb-2 shadow">
                    عرض خاص - خصم 30%
                  </span>
                  <h3 className="text-xl font-black text-white">سماعات الهدوء الاحترافية Pro Max</h3>
                  <p className="text-sm text-slate-300 mt-1">صوت نقي عالي الدقة مع عزل ضوضاء ذكي</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-2xl font-black text-indigo-400">$199.99</span>
                    <span className="text-xs text-slate-400 line-through">$285.00</span>
                  </div>
                </div>
              </div>

              {/* Floating Pill: Live Sync */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -left-5 glass px-4 py-3 rounded-2xl border border-indigo-500/40 shadow-glow flex items-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                <div>
                  <p className="text-[11px] text-slate-400">حالة المنتجات</p>
                  <p className="text-xs font-bold text-white">متزامن مع السيرفر ⚡</p>
                </div>
              </motion.div>

              {/* Floating Pill: Admin Ready */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-5 -right-5 glass px-4 py-3 rounded-2xl border border-pink-500/40 shadow-glow flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-sm">
                  ✓
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">لوحة التحكم</p>
                  <p className="text-xs font-bold text-white">جاهزة لإضافة المنتجات</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
