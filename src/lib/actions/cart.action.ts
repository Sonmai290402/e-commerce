import { TCartItem } from "@/types";
import { mutate } from "swr";

export async function fetchCart() {
  try {
    const res = await fetch("/api/cart", { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch cart");

    return await res.json();
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", error);
    return JSON.parse(localStorage.getItem("cart") || "[]"); // Dùng cache nếu API lỗi
  }
}

// 🛍️ Thêm sản phẩm vào giỏ hàng
export async function addToCart(item: TCartItem) {
  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (!res.ok) throw new Error("Failed to add item");

    await mutate("/api/cart", { revalidate: false });
  } catch (error) {
    console.error("🔥 Error adding item:", error);
  }
}

export async function updateCartItem(
  _id: string,
  action: "increase" | "decrease"
) {
  try {
    const res = await fetch(`/api/cart/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) throw new Error("Cập nhật số lượng thất bại");

    await mutate("/api/cart"); // Cập nhật lại giỏ hàng
  } catch (error) {
    console.error("Lỗi cập nhật giỏ hàng:", error);
  }
}

export async function removeCartItem(_id: string) {
  try {
    const res = await fetch(`/api/cart/${_id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

    await mutate("/api/cart"); // Cập nhật lại giỏ hàng
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
  }
}
