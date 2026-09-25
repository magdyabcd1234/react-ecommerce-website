import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  SlidersHorizontal, 
  Layers, 
  Search, 
  ShoppingBag,
  TrendingUp,
  Tag,
  Percent,
  ChevronDown
} from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { getCategoryArabicName } from '../services/api';

export default function HomePage() {
  const { 
    filteredProducts, 
    categories, 
    loading, 
    selectedCategory, 
    setSelectedCategory, 
    sortBy, 
    setSortBy, 
    searchQuery,
    setSearchQuery
  } = useProducts();

  const [visibleCount, setVisibleCount] = useState(24);
  const productsRef = useRef(null);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, searchQuery, sortBy]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const remainingCount = filteredProducts.length - visibleCount;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroBanner scrollToProducts={scrollToProducts} />

      {/* Main Storefront & Products */}
      <section ref={productsRef} id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-right">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>تشكيلة المنتجات المميزة ({filteredProducts.length} منتج)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              استكشف أحدث المعروضات
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              جميع الأجهزة الإلكترونية، اللابتوبات، ديكورات المنزل، الأزياء والمزيد مباشرة من الـ API
            </p>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs shadow-inner">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-400">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="default" className="bg-slate-900 text-white">المقترحات المميزة</option>
                <option value="price-low" className="bg-slate-900 text-white">السعر: من الأقل للأعلى</option>
                <option value="price-high" className="bg-slate-900 text-white">السعر: من الأعلى للأقل</option>
                <option value="rating" className="bg-slate-900 text-white">الأعلى تقييماً ★</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-glow scale-105'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>جميع الأقسام ({filteredProducts.length})</span>
            </button>

            {categories.map((cat) => {
              const catName = typeof cat === 'object' ? cat.name || cat.slug : cat;
              const isSelected = selectedCategory === catName;
              return (
                <button
                  key={catName}
                  onClick={() => setSelectedCategory(catName)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-glow scale-105'
                      : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span>{getCategoryArabicName(catName)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search status / active query notification */}
        {searchQuery && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200 text-right">
            <span>
              نتائج البحث عن: <strong className="text-white">"{searchQuery}"</strong> ({filteredProducts.length} منتج)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-pink-400 hover:text-pink-300 font-bold underline"
            >
              إلغاء البحث
            </button>
          </div>
        )}

        {/* Products Grid or Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl glass-card border border-slate-800 p-5 space-y-4 animate-shimmer">
                <div className="aspect-square rounded-2xl bg-slate-800"></div>
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                <div className="h-5 bg-slate-800 rounded w-4/5"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-800 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-800 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-3xl border border-slate-800 p-8 max-w-md mx-auto space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">لم يتم العثور على منتجات!</h3>
            <p className="text-slate-400 text-xs">
              لم نجد أي منتج يطابق معايير البحث الحالية. يمكنك مسح البحث أو اختيار قسم آخر.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all"
            >
              عرض جميع المنتجات
            </button>
          </motion.div>
        ) : (
          /* Staggered Products Grid */
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {displayedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {remainingCount > 0 && (
              <div className="mt-12 text-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass hover:bg-slate-800 text-white font-bold text-xs border border-indigo-500/40 shadow-glow transition-all"
                >
                  <span>عرض المزيد من المنتجات (متبقي {remainingCount} منتج)</span>
                  <ChevronDown className="w-4 h-4 text-indigo-400 animate-bounce" />
                </motion.button>
              </div>
            )}
          </>
        )}

      </section>

      {/* Promotional Banner Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border border-indigo-500/30 p-8 sm:p-12 shadow-glow text-right">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/30 border border-pink-400/40 text-pink-200 text-xs font-bold mb-4">
              <Percent className="w-3.5 h-3.5" />
              كوبون خصم حصري
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              وفر 20% إضافية على جميع المشتريات اليوم!
            </h3>
            <p className="text-indigo-200 text-sm mt-2 font-light">
              استخدم الرمز الترويجي <span className="font-mono font-bold bg-white text-indigo-900 px-2 py-0.5 rounded-md">NOVA20</span> في سلة التسوق للحصول على الخصم الفوري.
            </p>
            <button
              onClick={scrollToProducts}
              className="mt-6 px-6 py-3 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-lg transition-all"
            >
              تسوق واستفد من العرض
            </button>
          </div>
          
          <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-30 pointer-events-none">
            <Tag className="w-64 h-64 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
}
