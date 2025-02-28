// 📌 src/lib/utils/cart.utils.ts

import { TCartItem } from "@/types";

// Lấy giỏ hàng từ localStorage
export function getLocalCart(): TCartItem[] {
  if (typeof window === "undefined") return []; // Tránh lỗi trên server
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// Lưu giỏ hàng vào localStorage
export function saveLocalCart(cart: TCartItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

// Thêm sản phẩm vào localStorage
export function addToLocalCart(item: TCartItem) {
  const cart = getLocalCart();
  const existingItem = cart.find((p) => p._id === item._id);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveLocalCart(cart);
}

// Cập nhật số lượng sản phẩm trong localStorage
export function updateLocalCartItem(
  _id: string,
  action: "increase" | "decrease"
) {
  let cart = getLocalCart();
  cart = cart
    .map((item) => {
      if (item._id === _id) {
        const newQuantity =
          action === "increase" ? item.quantity + 1 : item.quantity - 1;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null; // Xóa nếu về 0
      }
      return item;
    })
    .filter(Boolean) as TCartItem[]; // Lọc bỏ các giá trị null

  saveLocalCart(cart);
}

// Xóa sản phẩm khỏi localStorage
export function removeLocalCartItem(_id: string) {
  const cart = getLocalCart().filter((item) => item._id !== _id);
  saveLocalCart(cart);
}

// Xóa toàn bộ giỏ hàng localStorage
export function clearLocalCart() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
  }
}
