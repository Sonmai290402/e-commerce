"use server";
import SubCategory from "@/database/subCategory.model";
import Category from "@/database/category.model";
import { connectToDatabase } from "../mongoose";

// Tạo SubCategory mới
export async function createSubCategory({
  title,
  categoryId,
  image,
  slug,
}: {
  title: string;
  categoryId: string;
  image: string;
  slug: string;
}) {
  try {
    await connectToDatabase();
    const parentCategory = await Category.findById(categoryId).lean();

    if (!parentCategory) {
      return { success: false, message: "Danh mục cha không tồn tại." };
    }
    // Kiểm tra nếu subCategory đã tồn tại
    const existedSubCategory = await SubCategory.findOne({ title }).lean();
    if (existedSubCategory) {
      return { success: false, message: "SubCategory đã tồn tại!" };
    }

    // Tạo subCategory mới
    const categorySlug = Array.isArray(parentCategory)
      ? parentCategory[0].slug
      : parentCategory.slug; // Lấy slug của danh mục cha
    const newSubCategory = new SubCategory({
      title,
      slug,
      image,
      categoryId,
      categorySlug: categorySlug, // Lưu sẵn categorySlug
    });
    await newSubCategory.save();
    // Cập nhật category với subCategory mới
    await Category.findByIdAndUpdate(categoryId, {
      $push: { subCategory: newSubCategory._id },
    });
    return { success: true, data: JSON.parse(JSON.stringify(newSubCategory)) };
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
    await connectToDatabase(); // Đảm bảo kết nối DB

    // Kiểm tra danh mục cha có tồn tại không
    const category = await Category.findById(categoryId).lean();
    if (!category) {
      console.log(`Không tìm thấy danh mục cha: ${categoryId}`);
      return [];
    }

    // Kiểm tra danh mục có danh sách subCategory không
    if (
      Array.isArray(category) ||
      !category.subCategory ||
      category.subCategory.length === 0
    ) {
      console.log(`Danh mục ${categoryId} không có subCategory.`);
      return [];
    }

    // Lấy danh sách subCategory theo danh mục cha
    const fields = includeImage ? "_id title image slug" : "_id title slug";
    const subCategories = await SubCategory.find({ categoryId })
      .select(fields)
      .lean();

    if (!subCategories.length) {
      console.log(`Không tìm thấy subCategory cho categoryId: ${categoryId}`);
      return [];
    }

    return subCategories.map((sub) => ({
      _id: String(sub._id),
      title: sub.title ?? "Danh mục con không tên",
      slug: sub.slug ?? "",
      ...(includeImage && { image: sub.image ?? "" }),
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh mục con:", error);
    return [];
  }
}

export async function getAllSubCategories() {
  try {
    const subCategories = await SubCategory.find()
      .select("_id title image slug categorySlug") // Lấy trực tiếp categorySlug
      .lean();

    return subCategories.map((sub) => ({
      _id: String(sub._id),
      title: sub.title ?? "Danh mục con không tên",
      image: sub.image ?? "",
      slug: sub.slug ?? "",
      categorySlug: sub.categorySlug, // Lấy trực tiếp từ DB
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh mục con:", error);
    return [];
  }
}
