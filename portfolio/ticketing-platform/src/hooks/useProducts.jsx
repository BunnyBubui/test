import { useState, useEffect } from "react";
import { selectServer } from "../utils/Server";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${selectServer()}/api/product`);
        const data = await res.json();
        console.log("📦 Products from backend:", data);

        if (res.ok && data.data) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }

      } catch (err) {
        console.error("❌ โหลดสินค้าล้มเหลว:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.length;
  };

  return { products, loading, addToCart, getCartCount };
};