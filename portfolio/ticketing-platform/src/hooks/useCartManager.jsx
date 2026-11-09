import { useState, useEffect } from "react";

export const useCartManager = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product, selectedSizes, quantity = 1) => {
    const detailedSizes = product.sizes.map((sub) => ({
      partId: sub.id,
      partName: sub.name,
      selectedSize: selectedSizes[sub.id] || null,
    }));

    const existingIndex = cart.findIndex((item) => {
      if (item.id !== product.id) return false;
      return item.sizes.every(
        (s, i) => s.selectedSize === detailedSizes[i].selectedSize
      );
    });

    if (existingIndex !== -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].total =
        updated[existingIndex].quantity * updated[existingIndex].price;
      setCart(updated);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        type: product.type,
        sizes: detailedSizes,
        quantity: quantity,
        price: product.price,
        total: product.price * quantity,
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    setCart,
    cartCount,
    addToCart,
    removeFromCart,
    clearCart,
  };
};
