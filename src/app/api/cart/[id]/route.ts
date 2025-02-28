import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import { TCartItem } from "@/types";

// 📌 Cập nhật số lượng hoặc xóa sản phẩm trong giỏ hàng
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = auth().userId;
    const { id } = params;
    const { action } = await req.json(); // Nhận action từ request body

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!["increase", "decrease"].includes(action))
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });

    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const item = user.cart.find(
      (item: TCartItem) => item._id.toString() === id
    );

    if (!item)
      return NextResponse.json(
        { message: "Product not found in cart" },
        { status: 404 }
      );

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    } else {
      return NextResponse.json(
        { message: "Cannot decrease below 1" },
        { status: 400 }
      );
    }

    await user.save();
    return NextResponse.json(user.cart);
  } catch (error) {
    console.error("🔥 Error in PATCH /api/cart/[id]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 📌 Xóa sản phẩm khỏi giỏ hàng
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = auth().userId;
    const { id } = params;

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.cart = user.cart.filter(
      (item: TCartItem) => item._id.toString() !== id
    );
    await user.save();

    return NextResponse.json(user.cart);
  } catch (error) {
    console.error("🔥 Error in DELETE /api/cart/[id]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
