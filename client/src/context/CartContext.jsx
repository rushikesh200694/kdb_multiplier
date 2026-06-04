import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kbd_cart') || '[]');
    } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kbd_wishlist') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('kbd_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('kbd_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity, unit, price) => {
    setCartItems(prev => {
      const key = `${product._id}-${unit}`;
      const existing = prev.find(item => `${item._id}-${item.selectedUnit}` === key);
      if (existing) {
        return prev.map(item =>
          `${item._id}-${item.selectedUnit}` === key
            ? { ...item, selectedQuantity: item.selectedQuantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, selectedQuantity: quantity, selectedUnit: unit, selectedPrice: price }];
    });
  };

  const removeFromCart = (productId, unit) => {
    setCartItems(prev => prev.filter(item => !(item._id === productId && item.selectedUnit === unit)));
  };

  const updateQuantity = (productId, unit, quantity) => {
    if (quantity <= 0) { removeFromCart(productId, unit); return; }
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId && item.selectedUnit === unit
          ? { ...item, selectedQuantity: quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.selectedPrice * item.selectedQuantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.selectedQuantity, 0);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p._id === product._id);
      return exists ? prev.filter(p => p._id !== product._id) : [...prev, product];
    });
  };

  const isWishlisted = (productId) => wishlist.some(p => p._id === productId);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount,
      wishlist, toggleWishlist, isWishlisted
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
