import React from 'react';
import { Sparkles, Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 text-right pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                نوفا ستور
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              متجرك الإلكتروني المتطور لتسوق أحدث المنتجات العالمية بأسعار تنافسية وجودة مضمونة، مع لوحة تحكم ذكية لإدارة المنتجات فورياً.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>تسوق آمن ومحمي 100%</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  الرئيسية والمتجر
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-400 transition-colors">
                  لوحة تحكم المدير
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-indigo-400 transition-colors">
                  تسجيل دخول الإدارة
                </Link>
              </li>
              <li>
                <a href="#products-section" className="hover:text-indigo-400 transition-colors">
                  أحدث المنتجات والعروض
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>القاهرة، مصر - متجر إلكتروني معتمد</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@novastore.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">النشرة البريدية</h4>
            <p className="text-xs text-slate-400 mb-3">
              اشترك للحصول على أحدث العروض الحصرية وخصومات نهاية الأسبوع.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('تم اشتراكك في النشرة بنجاح!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all"
              >
                اشتراك
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} نوفا ستور (NovaStore). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1">
            <span>صُنع بشغف واحترافية</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
