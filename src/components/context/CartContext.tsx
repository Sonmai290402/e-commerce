"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import useSWR, { mutate } from "swr";
import { TCartItem } from "@/types";
import { fetchCart } from "@/lib/actions/cart.action";
import { useAuth } from "@clerk/nextjs";
import { getLocalCart } from "@/lib/actions/localCart.action";

// Xác định kiểu dữ liệu cho Context
type CartContextType = {
  items: TCartItem[];
  setLocalItems?: (items: TCartItem[]) => void;
  isLoading: boolean;
  error: Error | null;
  refreshCart: () => void;
};

// Tạo Context
const CartContext = createContext<CartContextType | null>(null);

// Hàm fetch dữ liệu
const fetcher = async () => {
  try {
    const data = await fetchCart();
    return Array.isArray(data) ? data : []; // Đảm bảo luôn là mảng
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", error);
    return [];
  }
};

// CartProvider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const { data, error, isLoading } = useSWR(
    userId ? "/api/cart" : null,
    fetcher
  );
  const [localItems, setLocalItems] = useState<TCartItem[]>([]);

  // Khi không có userId → Load localCart từ localStorage
  useEffect(() => {
    if (!userId) {
      const localCart = getLocalCart();
      setLocalItems(localCart);
    }
  }, [userId]);
  useEffect(() => {
    const mergeCart = async () => {
      if (!userId) return;
      const localCart = getLocalCart();
      if (localCart.length === 0) return; // Không có gì để hợp nhất

      try {
        const res = await fetch("/api/cart/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(localCart),
        });

        if (res.ok) {
          localStorage.removeItem("cart"); // Xóa giỏ hàng tạm khi đã lưu lên server
          await mutate("/api/cart"); // Cập nhật giỏ hàng
        }
      } catch (error) {
        console.error("🔥 Error merging cart:", error);
      }
    };

    mergeCart();
  }, [userId]);

  return (
    <CartContext.Provider
      value={{
        items: userId ? data || [] : localItems, // Luôn đảm bảo items là một mảng
        isLoading,
        setLocalItems,
        error,
        refreshCart: () => {
          if (userId) mutate("/api/cart");
          setLocalItems(getLocalCart());
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook `useCart`
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
