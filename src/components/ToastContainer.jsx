import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ToastContainer() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border ${
            toast.type === 'success'
              ? 'bg-emerald-950/85 text-emerald-100 border-emerald-500/30 shadow-emerald-900/30'
              : toast.type === 'error'
              ? 'bg-rose-950/85 text-rose-100 border-rose-500/30 shadow-rose-900/30'
              : 'bg-indigo-950/85 text-indigo-100 border-indigo-500/30 shadow-indigo-900/30'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
          
          <span className="text-sm font-medium leading-relaxed">{toast.message}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
