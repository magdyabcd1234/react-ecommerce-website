import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  LayoutDashboard, 
  Search, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  Store
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

export default function Navbar() {
  const { totalCartCount, wishlistItems, setIsCartOpen, setIsWishlistOpen } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isStore = !location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-700/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                نوفا ستور
              </span>
              <span className="block text-[11px] font-medium text-indigo-400 -mt-1 tracking-wider uppercase">
                Nova Store & Admin
              </span>
            </div>
          </Link>

          {/* Search Bar (Only on Store pages) */}
          {isStore && (
            <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن منتج، ماركة، أو قسم..."
                  className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-400 text-sm rounded-xl pr-11 pl-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
                <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Actions & Navigation */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Storefront Link if in Admin */}
            {!isStore ? (
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-slate-700/50"
              >
                <Store className="w-4 h-4 text-indigo-400" />
                العودة للمتجر
              </Link>
            ) : null}

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-700/50"
              title="المفضلة"
            >
              <Heart className="w-5 h-5 text-pink-400" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {wishlistItems.length}
                </span>
              )}
            </motion.button>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-glow transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>السلة</span>
              {totalCartCount > 0 && (
                <motion.span
                  key={totalCartCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="bg-white text-indigo-700 text-xs font-black px-2 py-0.5 rounded-full shadow"
                >
                  {totalCartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Admin / Dashboard Link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pr-2 border-r border-slate-700">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-indigo-500/30 transition-all hover:border-indigo-400"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>لوحة التحكم</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 text-slate-300 hover:text-white text-sm font-medium border border-slate-700 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>دخول الإدارة</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-300"
            >
              <ShoppingBag className="w-6 h-6 text-indigo-400" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isStore && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج، ماركة، أو قسم..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 text-sm rounded-xl pr-10 pl-4 py-2.5 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-slate-800 px-4 py-5 space-y-3"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 text-slate-200"
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-400" />
                الرئيسية والمتجر
              </span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsWishlistOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/60 text-slate-200 text-right"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                المفضلة
              </span>
              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">{wishlistItems.length}</span>
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-indigo-900/40 text-indigo-200 border border-indigo-500/30"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    لوحة التحكم (المدير)
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 text-rose-300 text-right border border-rose-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-indigo-600 text-white font-medium shadow-glow"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  دخول لوحة التحكم (المدير)
                </span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
