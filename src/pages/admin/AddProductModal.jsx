import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Image as ImageIcon 
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { getCategoryArabicName } from '../../services/api';
import confetti from 'canvas-confetti';

// Rich Curated Presets by Category
const CATEGORY_IMAGE_PRESETS = {
  'laptops': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
  ],
  'home-decoration': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&auto=format&fit=crop&q=80'
  ],
  'smartphones': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
  ],
  'mobile-accessories': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584679109597-c656b19974c9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80'
  ],
  'furniture': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80'
  ],
  'fragrances': [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
  ],
  'beauty': [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80'
  ],
  'skin-care': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597359-00e998188151?w=800&auto=format&fit=crop&q=80'
  ],
  'mens-watches': [
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
  ],
  'womens-watches': [
    'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80'
  ],
  'sunglasses': [
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
  ],
  'mens-shoes': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80'
  ],
  'kitchen-accessories': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584990347449-74c7e6c382bf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80'
  ]
};

const DEFAULT_PRESETS = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
];

export default function AddProductModal({ isOpen, onClose, editingProduct = null }) {
  const { addProduct, updateProduct, categories, products } = useProducts();
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'smartphones',
    stock: 20,
    discountPercentage: 0,
    description: '',
    thumbnail: ''
  });

  const [customCategory, setCustomCategory] = useState('');
  const [imageError, setImageError] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  // Initialize or reset form data when opening modal
  useEffect(() => {
    if (editingProduct) {
      // Prioritize the product's OWN thumbnail and image
      const productExactThumbnail = editingProduct.thumbnail || editingProduct.images?.[0] || '';
      
      setFormData({
        title: editingProduct.title || '',
        price: editingProduct.price !== undefined ? editingProduct.price : '',
        category: editingProduct.category || 'smartphones',
        stock: editingProduct.stock !== undefined ? editingProduct.stock : 20,
        discountPercentage: editingProduct.discountPercentage || 0,
        description: editingProduct.description || '',
        thumbnail: productExactThumbnail
      });
    } else {
      const defaultCat = categories[0] ? (typeof categories[0] === 'object' ? categories[0].slug || categories[0].name : categories[0]) : 'smartphones';
      const initialPresets = CATEGORY_IMAGE_PRESETS[defaultCat] || DEFAULT_PRESETS;

      setFormData({
        title: '',
        price: '',
        category: defaultCat,
        stock: 25,
        discountPercentage: 0,
        description: '',
        thumbnail: initialPresets[0]
      });
    }
    setImageError(false);
  }, [editingProduct, isOpen, categories]);

  // Compute DYNAMIC sample images based on category, prioritizing current product image
  const dynamicSampleImages = useMemo(() => {
    const currentCat = formData.category;
    
    // 1. Gather images from API products in this category
    const categoryAPIImages = products
      .filter(p => p.category === currentCat && (p.thumbnail || p.images?.[0]))
      .map(p => p.thumbnail || p.images[0]);

    // 2. Curated presets
    const curatedPresets = CATEGORY_IMAGE_PRESETS[currentCat] || DEFAULT_PRESETS;

    // 3. If editing, ensure the product's OWN image is included at the top
    const ownImage = editingProduct ? [editingProduct.thumbnail, ...(editingProduct.images || [])] : [];

    const allCombined = Array.from(new Set([...ownImage, ...categoryAPIImages, ...curatedPresets])).filter(Boolean);

    if (shuffleKey > 0) {
      // Keep own image first if editing, shuffle the rest
      if (editingProduct && editingProduct.thumbnail) {
        const others = allCombined.filter(img => img !== editingProduct.thumbnail);
        return [editingProduct.thumbnail, ...others.sort(() => 0.5 - Math.random())].slice(0, 8);
      }
      return [...allCombined].sort(() => 0.5 - Math.random()).slice(0, 8);
    }
    return allCombined.slice(0, 8);
  }, [formData.category, products, shuffleKey, editingProduct]);

  if (!isOpen) return null;

  // Handle local image file upload (Base64)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, thumbnail: event.target.result }));
        showToast('تم تحميل صورتك من الجهاز وتعيينها للمنتج! 📸', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Safe category change that DOES NOT overwrite the user's thumbnail
  const handleCategoryChange = (newCat) => {
    setFormData(prev => ({
      ...prev,
      category: newCat
      // Notice: prev.thumbnail is PRESERVED so product's own image is never replaced!
    }));
  };

  const handleShuffle = () => {
    setShuffleKey(prev => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.thumbnail) {
      showToast('يرجى ملء جميع الحقول المطلوبة واختيار صورة', 'error');
      return;
    }

    const finalCategory = customCategory.trim() ? customCategory.trim() : formData.category;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        category: finalCategory
      });
      showToast(`تم حفظ وتحديث بيانات المنتج "${formData.title}" بنجاح! ✨`, 'success');
    } else {
      addProduct({
        ...formData,
        category: finalCategory
      });
      showToast(`تمت إضافة المنتج الجديد "${formData.title}" للمتجر والداشبورد! 🎉`, 'success');
      
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch (err) {}
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {/* Outer fixed backdrop with top-aligned flex and auto-scrolling */}
      <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-start justify-center min-h-screen py-6 sm:py-10">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Card with max-h-[90vh] and vertical flex layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl glass-card rounded-3xl border border-slate-700/80 shadow-2xl z-10 text-right flex flex-col max-h-[88vh] my-auto overflow-hidden"
        >
          
          {/* 1. Fixed Modal Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 shrink-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-glow shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {editingProduct 
                    ? `تعديل صورة ومواصفات: ${editingProduct.title.slice(0, 35)}...` 
                    : 'أدخل تفاصيل وصورة المنتج ليظهر فورياً في المتجر ولوحة التحكم'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Scrollable Modal Body Form */}
          <form id="product-form" onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم المنتج *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: لابتوب ديل XPS 15 أو مصباح ديكور خشبي بوهيمي"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Price & Stock & Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  السعر ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="99.99"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  الكمية بالمخزون *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="25"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  نسبة الخصم (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  placeholder="15"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  القسم / التصنيف
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {categories.map((cat) => {
                    const c = typeof cat === 'object' ? cat.name || cat.slug : cat;
                    return (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {getCategoryArabicName(c)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  أو قسم يدوي مخصص
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="مثال: accessories"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Product Image Section */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>صورة المنتج الخاصة به *</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                    title="تبديل النماذج المقترحة"
                  >
                    <RefreshCw className="w-3 h-3 text-pink-400" />
                    <span>تبديل النماذج</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Sample Thumbnails */}
              <div>
                <p className="text-[11px] text-slate-400 mb-1.5">
                  {editingProduct 
                    ? 'اختر صورة من النماذج المقترحة، أو ارفع صورة جديدة خاصة بالمنتج:' 
                    : 'نماذج مقترحة سريعة لقسم ' + getCategoryArabicName(formData.category) + ':'}
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {dynamicSampleImages.map((imgUrl, i) => {
                    const isSelected = formData.thumbnail === imgUrl;
                    const isOriginal = editingProduct && (editingProduct.thumbnail === imgUrl || editingProduct.images?.[0] === imgUrl);
                    return (
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        key={`${formData.category}-${i}-${imgUrl.slice(-10)}`}
                        onClick={() => setFormData({ ...formData, thumbnail: imgUrl })}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          isSelected 
                            ? 'border-indigo-500 shadow-glow ring-2 ring-indigo-500/50 scale-105' 
                            : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                        title={isOriginal ? 'صورة المنتج الأصلية' : 'نموذج مقترح'}
                      >
                        <img 
                          src={imgUrl} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                        {isSelected && (
                          <span className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </span>
                        )}
                        {isOriginal && (
                          <span className="absolute bottom-0 right-0 left-0 bg-pink-600 text-white text-[8px] font-black text-center py-0.5">
                            الأصلية
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Image Input Options: Direct URL or PC Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                <div className="sm:col-span-8">
                  <input
                    type="url"
                    required
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="رابط صورة مباشر https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <label className="sm:col-span-4 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-slate-200 text-xs font-semibold cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-pink-400" />
                  <span>رفع من الكمبيوتر</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Live Preview Box */}
              {formData.thumbnail && (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-700">
                    <img
                      src={formData.thumbnail}
                      alt="معاينة"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-200 font-bold text-[11px]">معاينة الصورة المعتمدة للمنتج</p>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                        {formData.thumbnail.startsWith('data:') ? 'مرفوعة محلياً 💻' : 'رابط ويب 🌐'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      {imageError ? (
                        <span className="text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3" />
                          تعذر تحميل الصورة من الرابط، جرب رابطاً آخر أو ارفع من جهازك
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <Check className="w-3 h-3" />
                          الصورة متصلة وجاهزة للعرض
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                وصف المنتج ومميزاته
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="اكتب وصفاً جذاباً يشرح مزايا ومواصفات المنتج..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

          </form>

          {/* 3. Fixed Modal Footer with Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-800 shrink-0 bg-slate-900/95 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              إلغاء
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              form="product-form"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج فورياً'}</span>
            </motion.button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
