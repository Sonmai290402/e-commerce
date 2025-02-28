import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import { TCartItem } from "@/types";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const userId = auth().userId;
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const localCart: TCartItem[] = await req.json();
    if (!Array.isArray(localCart) || localCart.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    // 🔹 Tìm user
    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (!user.cart) user.cart = [];

    // 🔥 Hợp nhất giỏ hàng an toàn
    localCart.forEach((localItem) => {
      const existingItem = user.cart.find(
        (item: TCartItem) => String(item._id) === String(localItem._id) // 🔹 So sánh ObjectId dưới dạng string
      );

      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        const { _id, ...rest } = localItem;
        user.cart.push({
          _id: new mongoose.Types.ObjectId(_id), // 🔹 Chuyển thành ObjectId
          ...rest,
        });
      }
    });

    // 🔹 Dùng `findByIdAndUpdate` để tránh VersionError
    await User.findByIdAndUpdate(user._id, { $set: { cart: user.cart } });

    return NextResponse.json({ message: "Cart merged successfully" });
  } catch (error) {
    console.error("🔥 Error merging cart:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
