import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cart items
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shopping_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist items
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('user_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Active toast message
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('user_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`تمت إضافة "${product.title.slice(0, 25)}..." إلى سلة الشراء بنجاح!`, 'success');
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast('تم حذف المنتج من السلة', 'info');
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    const isSaved = wishlistItems.some(item => item.id === product.id);
    if (isSaved) {
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      showToast(`تمت إزالة المنتج من المفضلة`, 'info');
    } else {
      setWishlistItems(prev => [...prev, product]);
      showToast(`تمت إضافة المنتج إلى المفضلة ❤️`, 'success');
    }
  };

  const isInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  // Calculated stats
  const totalCartCount = cartItems.length;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : (cartItems.length > 0 ? 15 : 0);
  const tax = subtotal * 0.05; // 5% VAT
  const totalAmount = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        totalCartCount,
        subtotal,
        shipping,
        tax,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
