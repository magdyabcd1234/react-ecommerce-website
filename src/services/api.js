// DummyJSON API Service for Products

const BASE_URL = 'https://dummyjson.com';

export const CATEGORY_NAMES_AR = {
  'all': 'جميع الأقسام',
  'laptops': 'لابتوبات وحواسيب 💻',
  'smartphones': 'هواتف ذكية 📱',
  'tablets': 'أجهزة لوحية 📲',
  'mobile-accessories': 'إكسسوارات الجوال 🎧',
  'home-decoration': 'ديكور ومستلزمات منزلية 🏺',
  'furniture': 'أثاث وديكور 🛋️',
  'lighting': 'إضاءات وديكور 💡',
  'kitchen-accessories': 'أدوات المطبخ 🍳',
  'fragrances': 'عطور فاخرة ✨',
  'beauty': 'عناية وجمال 💄',
  'skin-care': 'العناية بالبشرة 🧴',
  'groceries': 'بقالة وأغذية 🛒',
  'mens-shirts': 'قمصان رجالية 👔',
  'mens-shoes': 'أحذية رجالية 👞',
  'mens-watches': 'ساعات رجالية ⌚',
  'womens-dresses': 'فساتين نسائية 👗',
  'womens-shoes': 'أحذية نسائية 👠',
  'womens-watches': 'ساعات نسائية ⌚',
  'womens-bags': 'حقائب نسائية 👜',
  'womens-jewellery': 'مجوهرات وإكسسوارات 💍',
  'sunglasses': 'نظارات شمسية 🕶️',
  'sports-accessories': 'مستلزمات رياضية ⚽',
  'motorcycle': 'دراجات نارية 🏍️',
  'vehicle': 'سيارات ومحركات 🚗',
  'tops': 'ملابس وأزياء 👕',
  'electronics': 'إلكترونيات ⚡',
  'fashion': 'أزياء وموضة 🛍️',
  'home': 'المنزل العصري 🏡',
  'shoes': 'أحذية رياضية 👟'
};

export const getCategoryArabicName = (cat) => {
  if (!cat) return 'عام';
  const slug = typeof cat === 'object' ? (cat.slug || cat.name || '') : String(cat);
  return CATEGORY_NAMES_AR[slug.toLowerCase()] || CATEGORY_NAMES_AR[slug] || slug;
};

// Rich initial fallback in case of connection limits
const FALLBACK_PRODUCTS = [
  {
    id: 101,
    title: 'Apple MacBook Pro 16 M3 Max',
    description: 'شاشة Liquid Retina XDR مذهلة، معالج M3 Max فائق القوة، ذاكرة 36GB موحدة، وبطارية تدوم حتى 22 ساعة.',
    price: 2499.00,
    discountPercentage: 8,
    rating: 4.95,
    stock: 14,
    brand: 'Apple',
    category: 'laptops',
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80']
  },
  {
    id: 102,
    title: 'مصباح ديكور خشبي بوهيمي فاخر',
    description: 'مصباح طاولة مصنوع يدوياً من الخشب الطبيعي والقماش الفاخر، يعطي إضاءة دافئة ومريحة لأجواء منزلية راقية.',
    price: 68.50,
    discountPercentage: 15,
    rating: 4.8,
    stock: 28,
    brand: 'HomeElegance',
    category: 'home-decoration',
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80']
  },
  {
    id: 103,
    title: 'مزهرية سيراميك فنية عصرية (Art Vase)',
    description: 'تحفة ديكورية فنية منحوتة من السيراميك الأبيض غير اللامع لإضفاء لمسة فخامة عصرية على غرفة المعيشة أو المكتب.',
    price: 45.00,
    discountPercentage: 12,
    rating: 4.7,
    stock: 35,
    brand: 'DecoLux',
    category: 'home-decoration',
    thumbnail: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80']
  },
  {
    id: 104,
    title: 'سماعات رأس لاسلكية احترافية فاخرة Pro Max',
    description: 'سماعات بلوتوث فائقة النقاء مع ميزة إلغاء الضوضاء النشط وعمر بطارية يدوم حتى 40 ساعة من الاستخدام المتواصل.',
    price: 199.99,
    discountPercentage: 15,
    rating: 4.8,
    stock: 24,
    brand: 'NovaTech',
    category: 'mobile-accessories',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80']
  },
  {
    id: 105,
    title: 'ساعة ذكية رياضية متطورة مقاومة للماء Ultra',
    description: 'شاشة AMOLED فائقة الدقة، متتبع نبضات القلب ونسبة الأكسجين، متوافقة مع جميع أنظمة الهواتف الذكية.',
    price: 149.50,
    discountPercentage: 20,
    rating: 4.9,
    stock: 18,
    brand: 'ChronoMax',
    category: 'smartphones',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80']
  }
];

export const fetchProductsFromAPI = async () => {
  try {
    // Fetch ALL 194 products across all categories
    const res = await fetch(`${BASE_URL}/products?limit=0`);
    if (!res.ok) throw new Error('فشل جلب المنتجات من الخادم');
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.warn('API Error, using fallback products:', error);
    return FALLBACK_PRODUCTS;
  }
};

export const fetchCategoriesFromAPI = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products/category-list`);
    if (!res.ok) throw new Error('فشل جلب الأقسام');
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('API Category Error, using fallback:', error);
    return Object.keys(CATEGORY_NAMES_AR).filter(k => k !== 'all');
  }
};
