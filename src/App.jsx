import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      {/* Global Interactive Overlays */}
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <ToastContainer />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Routes */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Global Footer (shown on storefront and login) */}
      {!location.pathname.startsWith('/admin') && <Footer />}
    </div>
  );
}
