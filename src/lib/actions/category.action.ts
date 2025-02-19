"use server";
import Category from "@/database/category.modal";
import { connectToDatabase } from "../mongoose";

// Tạo Category mới
export async function createCategory(title: string, image: string) {
  try {
    await connectToDatabase();

    // Kiểm tra xem category đã tồn tại chưa
    const existedCategory = await Category.findOne({ title }).lean();
    if (existedCategory) {
      return { success: false, message: "Category đã tồn tại!" };
    }

    const category = await Category.create({ title, image });
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    console.error("Lỗi khi tạo Category:", error);
    return { success: false, message: "Đã xảy ra lỗi khi tạo Category." };
  }
}

// Lấy danh sách Category kèm subCategory (_id, title)
export async function getCategories(includeImage: boolean = false) {
  try {
    connectToDatabase();
    const fields = includeImage ? "_id title image" : "_id title";
    const categories = await Category.find().select(fields);
    return categories.map((cat) => ({
      _id: String(cat._id),
      title: cat.title ?? "Danh mục không tên",
      ...(includeImage && { image: cat.image ?? "" }), // Chỉ thêm image nếu includeImage = true
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return [];
  }
}
