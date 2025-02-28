import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import { TCartItem } from "@/types";

// 📌 Lấy giỏ hàng
export async function GET() {
  try {
    await connectToDatabase();
    const userId = auth().userId;

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = (await User.findOne({
      clerkId: userId,
    }).lean()) as unknown as { cart: TCartItem[] };
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json((user && user.cart) || []);
  } catch (error) {
    console.error("🔥 Error in GET /api/cart:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 📌 Thêm sản phẩm vào giỏ hàng
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const userId = auth().userId;

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const newItem: TCartItem = await req.json();
    if (!newItem._id)
      return NextResponse.json(
        { message: "Missing product ID" },
        { status: 400 }
      );

    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const existingItem = user.cart.find(
      (item: TCartItem) => item._id.toString() === newItem._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += newItem.quantity;
    } else {
      user.cart.push(newItem);
    }

    await user.save();
    return NextResponse.json(user.cart);
  } catch (error) {
    console.error("🔥 Error in POST /api/cart:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 📌 Xóa sản phẩm khỏi giỏ hàng
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const userId = auth().userId;

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { _id } = await req.json(); // Lấy _id từ body request

    if (!_id)
      return NextResponse.json(
        { message: "Missing product ID" },
        { status: 400 }
      );

    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.cart = user.cart.filter(
      (item: TCartItem) => item._id.toString() !== _id
    );
    await user.save();

    return NextResponse.json(user.cart);
  } catch (error) {
    console.error("🔥 Error in DELETE /api/cart:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
