"use client";

import { createContext, useContext, ReactNode } from "react";
import useSWR, { mutate } from "swr";
import { TCartItem } from "@/types";
import { fetchCart } from "@/lib/actions/cart.action";

// Xác định kiểu dữ liệu cho Context
type CartContextType = {
  items: TCartItem[];
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
  const { data, error, isLoading } = useSWR("/api/cart", fetcher);

  return (
    <CartContext.Provider
      value={{
        items: data || [], // Luôn đảm bảo items là một mảng
        isLoading,
        error,
        refreshCart: () => mutate("/api/cart"),
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
