"use server";
import SubCategory from "@/database/subCategory.modal";
import Category from "@/database/category.modal";
import { connectToDatabase } from "../mongoose";

// Tạo SubCategory mới
export async function createSubCategory({
  title,
  categoryId,
  image,
}: {
  title: string;
  categoryId: string;
  image: string;
}) {
  try {
    await connectToDatabase();

    // Kiểm tra nếu subCategory đã tồn tại
    const existedSubCategory = await SubCategory.findOne({ title }).lean();
    if (existedSubCategory) {
      return { success: false, message: "SubCategory đã tồn tại!" };
    }

    // Tạo subCategory mới
    const subCategory = await SubCategory.create({
      title,
      category: categoryId,
      image,
    });

    // Cập nhật category với subCategory mới
    await Category.findByIdAndUpdate(categoryId, {
      $push: { subCategory: subCategory._id },
    });

    return { success: true, data: JSON.parse(JSON.stringify(subCategory)) };
  } catch (error) {
    console.error("Lỗi khi tạo SubCategory:", error);
    return { success: false, message: "Đã xảy ra lỗi khi tạo SubCategory." };
  }
}

export async function getSubCategories(
  categoryId: string,
  includeImage: boolean = false
) {
  try {
    const category = await Category.findById(categoryId).lean();
    if (!category) {
      console.log("Không tìm thấy danh mục.");
      return [];
    }
    if (!("subCategory" in category) || !Array.isArray(category.subCategory)) {
      console.log("Danh mục không có subCategory hợp lệ.");
      return [];
    }

    // Chọn các trường cần lấy
    const fields = includeImage ? "_id title image" : "_id title";
    const subCategories = await SubCategory.find({
      _id: { $in: category.subCategory },
    })
      .select(fields)
      .lean();

    return subCategories.map((sub) => ({
      _id: String(sub._id),
      title: sub.title ?? "Danh mục con không tên",
      ...(includeImage && { image: sub.image ?? "" }), // Chỉ thêm image nếu includeImage = true
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh mục con:", error);
    return [];
  }
}

export async function getAllSubCategories() {
  try {
    const subCategories = await SubCategory.find()
      .select("_id title image")
      .lean();

    return subCategories.map((sub) => ({
      _id: String(sub._id),
      title: sub.title ?? "Danh mục con không tên",
      image: sub.image ?? "",
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh mục con:", error);
    return [];
  }
}
