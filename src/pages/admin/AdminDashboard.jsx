import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  DollarSign, 
  Star, 
  AlertTriangle, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  LogOut, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  Store,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { getCategoryArabicName } from '../../services/api';
import AddProductModal from './AddProductModal';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { products, deleteProduct, setQuickViewProduct, categories } = useProducts();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [searchTable, setSearchTable] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Compute KPI statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) <= 5).length;
  const avgRating = (products.reduce((acc, p) => acc + (p.rating || 5), 0) / (totalProducts || 1)).toFixed(1);

  // Filtered list for the admin table
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTable.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTable.toLowerCase()));
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      showToast(`تم حذف المنتج "${productToDelete.title}" بنجاح`, 'info');
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 text-right">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-glow"
              />
              <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{user?.name || 'مدير المتجر'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  لوحة الإدارة الرئيسية
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                البريد: {user?.email} • متصل الآن بكامل الصلاحيات
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة منتج جديد</span>
            </motion.button>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
            >
              <Store className="w-4 h-4 text-indigo-400" />
              <span>عرض المتجر</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-3xl p-6 border border-slate-700/60 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">إجمالي المنتجات</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-white">{totalProducts}</h3>
              <span className="text-xs text-emerald-400 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 ml-0.5" /> +12%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">منتجات مفعلة على المتجر</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6 border border-slate-700/60 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">قيمة المخزون الإجمالية</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-white">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</h3>
              <span className="text-xs text-emerald-400 font-bold">نشط</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">محسوبة حسب كميات المخزون</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-3xl p-6 border border-slate-700/60 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">متوسط تقييم المتجر</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-white">{avgRating} / 5.0</h3>
              <span className="text-xs text-amber-400 font-bold">ممتاز</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">بناءً على تقييمات المشترين</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-6 border border-slate-700/60 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">تنبيهات انخفاض المخزون</span>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-rose-400">{lowStockCount}</h3>
              <span className="text-xs text-rose-400 font-bold">عناصر تحتاج تزويد</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">أقل من 5 قطع بالمخزن</p>
          </motion.div>
        </div>

        {/* Products Management Table Card */}
        <div className="glass-card rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
          
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>إدارة كتالوج المنتجات</span>
                <span className="text-xs font-normal text-slate-400">({filteredProducts.length} منتج معروض)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تعديل، حذف، أو استعراض أي منتج مباشرة
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="ابحث في المنتجات..."
                  value={searchTable}
                  onChange={(e) => setSearchTable(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">جميع الأقسام ({products.length})</option>
                {categories.map((c) => {
                  const val = typeof c === 'object' ? c.slug || c.name : c;
                  return (
                    <option key={val} value={val} className="bg-slate-900 text-white">
                      {getCategoryArabicName(val)}
                    </option>
                  );
                })}
              </select>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-glow flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">المنتج</th>
                  <th className="px-6 py-4">القسم</th>
                  <th className="px-6 py-4">السعر</th>
                  <th className="px-6 py-4">الخصم</th>
                  <th className="px-6 py-4">المخزون</th>
                  <th className="px-6 py-4">التقييم</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const isLow = (p.stock || 0) <= 5;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Product image & title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail || (p.images && p.images[0])}
                            alt=""
                            className="w-12 h-12 rounded-xl object-contain bg-slate-800 p-1 border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs line-clamp-1">{p.title}</span>
                              {p.isCustom && (
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                  مضاف يدوياً
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{p.description}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
<td className="px-6 py-4">
  <span className="inline-block max-w-[120px] truncate bg-slate-800 px-2.5 py-1 rounded-lg text-indigo-300 border border-slate-700">
    {getCategoryArabicName(p.category)}
  </span>
</td>

                      {/* Price */}
                      <td className="px-6 py-4 font-black text-white text-sm">
                        ${p.price}
                      </td>

                      {/* Discount */}
                      <td className="px-6 py-4">
                        {p.discountPercentage > 0 ? (
                          <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                            %{Math.round(p.discountPercentage)}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isLow ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
                          <span className={`font-semibold ${isLow ? 'text-rose-400' : 'text-slate-300'}`}>
                            {p.stock || 20} قطعة
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{p.rating ? Number(p.rating).toFixed(1) : '5.0'}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setQuickViewProduct(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="معاينة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <p className="text-sm font-bold text-white">لا توجد منتجات تطابق البحث</p>
                <p className="text-xs">جرب تغيير كلمة البحث أو فلتر الأقسام.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-card rounded-3xl border border-rose-500/40 p-6 shadow-2xl z-10 text-right space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">تأكيد حذف المنتج</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف المنتج: <strong className="text-white">"{productToDelete.title}"</strong>؟ لن يظهر هذا المنتج في المتجر بعد الآن.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  نعم، احذف المنتج
                </button>
                <button
                  onClick={() => setProductToDelete(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
