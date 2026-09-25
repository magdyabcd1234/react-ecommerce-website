import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProductsFromAPI, fetchCategoriesFromAPI } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'rating'

  // Selected product for preview modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Fetch initial data & merge with locally stored custom products
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [apiProducts, apiCategories] = await Promise.all([
          fetchProductsFromAPI(),
          fetchCategoriesFromAPI()
        ]);

        // Load custom local products added by Admin
        const localCustom = localStorage.getItem('custom_products');
        const customProducts = localCustom ? JSON.parse(localCustom) : [];

        // Check if any deleted products list exists
        const localDeleted = localStorage.getItem('deleted_product_ids');
        const deletedIds = localDeleted ? JSON.parse(localDeleted) : [];

        // Combine custom products (at the top) with API products (excluding deleted)
        const combined = [
          ...customProducts,
          ...apiProducts.filter(p => !deletedIds.includes(p.id))
        ];

        setProducts(combined);

        // Ensure all categories present across API products, categories list, and custom products are included
        const rawCategories = [
          ...apiCategories.map(c => typeof c === 'object' ? c.slug || c.name : c),
          ...apiProducts.map(p => p.category),
          ...customProducts.map(p => p.category)
        ].filter(Boolean);

        // Put popular categories like laptops, home-decoration, smartphones at the top
        const priorityCategories = [
          'laptops',
          'smartphones',
          'home-decoration',
          'tablets',
          'mobile-accessories',
          'furniture',
          'lighting',
          'kitchen-accessories',
          'fragrances',
          'beauty',
          'skin-care',
          'groceries',
          'mens-shirts',
          'mens-shoes',
          'mens-watches',
          'womens-dresses',
          'womens-bags',
          'sunglasses',
          'sports-accessories'
        ];

        const uniqueSet = new Set(rawCategories);
        const sortedCategories = [
          ...priorityCategories.filter(cat => uniqueSet.has(cat)),
          ...Array.from(uniqueSet).filter(cat => !priorityCategories.includes(cat))
        ];

        setCategories(sortedCategories);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('تعذر تحميل المنتجات');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Add Product (Admin Action)
  const addProduct = (newProductData) => {
    const newProduct = {
      ...newProductData,
      id: Date.now(), // Unique ID
      price: parseFloat(newProductData.price) || 0,
      discountPercentage: parseFloat(newProductData.discountPercentage) || 0,
      stock: parseInt(newProductData.stock) || 10,
      rating: 5.0, // New product default rating
      images: [newProductData.thumbnail],
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);

    // Save to localStorage for persistence
    const localCustom = localStorage.getItem('custom_products');
    const customList = localCustom ? JSON.parse(localCustom) : [];
    customList.unshift(newProduct);
    localStorage.setItem('custom_products', JSON.stringify(customList));

    // Update categories if new category was added
    if (newProduct.category && !categories.includes(newProduct.category)) {
      setCategories(prev => [newProduct.category, ...prev]);
    }

    return newProduct;
  };

  // Edit Product
  const updateProduct = (id, updatedData) => {
    const newThumbnail = updatedData.thumbnail;
    let targetUpdated = null;

    const updated = products.map(p => {
      if (p.id === id) {
        const updatedItem = {
          ...p,
          ...updatedData,
          thumbnail: newThumbnail || p.thumbnail,
          images: newThumbnail ? [newThumbnail] : (p.images && p.images.length > 0 ? p.images : [newThumbnail || p.thumbnail]),
          price: parseFloat(updatedData.price) || p.price,
          discountPercentage: parseFloat(updatedData.discountPercentage) || p.discountPercentage,
          stock: parseInt(updatedData.stock) || p.stock
        };
        targetUpdated = updatedItem;
        return updatedItem;
      }
      return p;
    });

    setProducts(updated);

    // Save/update in localStorage
    const localCustom = localStorage.getItem('custom_products');
    const customList = localCustom ? JSON.parse(localCustom) : [];
    const existingIndex = customList.findIndex(p => p.id === id);

    if (existingIndex !== -1) {
      customList[existingIndex] = targetUpdated;
    } else if (targetUpdated) {
      customList.unshift(targetUpdated);
    }
    localStorage.setItem('custom_products', JSON.stringify(customList));
  };

  // Delete Product
  const deleteProduct = (id) => {
    // Filter out from current state
    const filtered = products.filter(p => p.id !== id);
    setProducts(filtered);

    // Remove from custom if it exists
    const localCustom = localStorage.getItem('custom_products');
    if (localCustom) {
      const customList = JSON.parse(localCustom).filter(p => p.id !== id);
      localStorage.setItem('custom_products', JSON.stringify(customList));
    }

    // Also mark as deleted so API products don't reappear on refresh
    const localDeleted = localStorage.getItem('deleted_product_ids');
    const deletedIds = localDeleted ? JSON.parse(localDeleted) : [];
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('deleted_product_ids', JSON.stringify(deletedIds));
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // Default
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        categories,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        quickViewProduct,
        setQuickViewProduct,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
