"use server";
import Product, { IProduct } from "@/database/product.model";
import { TCreateProductParams } from "@/types";
import { TUpdateProductParams } from "@/types";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import Category from "@/database/category.model";
import SubCategory from "@/database/subCategory.model";
// fetching
export async function getProductBySlug({ slug }: { slug: string }) {
  try {
    await connectToDatabase();
    const findProduct = await Product.findOne({ slug });
    return JSON.parse(JSON.stringify(findProduct));
  } catch (error) {
    console.log(error);
  }
}
// CRUD
export async function createProduct(params: TCreateProductParams) {
  try {
    connectToDatabase();
    const existedProduct = await Product.findOne({ slug: params.slug }).lean();
    if (existedProduct) {
      return {
        success: false,
        message: "Sản phẩm đã tồn tại",
      };
    }

    // Tìm danh mục cha (Category)
    const category = await Category.findById(params.category).lean();
    if (!category) {
      return { success: false, message: "Danh mục cha không tồn tại" };
    }
    const categorySlug = Array.isArray(category)
      ? category[0].slug
      : category.slug; // Lấy slug của danh mục cha
    // Tìm danh mục con (SubCategory)
    const subCategory = await SubCategory.findById(params.subCategory).lean();
    if (!subCategory) {
      return { success: false, message: "Danh mục con không tồn tại" };
    }
    const subCategorySlug = Array.isArray(subCategory)
      ? subCategory[0].slug
      : subCategory.slug; // Lấy slug của danh mục con

    const productData = {
      ...params,
      categorySlug, // Lưu slug của danh mục cha
      subCategorySlug, // Lưu slug của danh mục con
    };

    const product = await Product.create(productData);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDatabase();
    const products = await Product.find();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateProduct(params: TUpdateProductParams) {
  try {
    await connectToDatabase();
    const findProduct = await Product.findOne({ slug: params.slug });
    if (!findProduct) return;
    await Product.findOneAndUpdate({ slug: params.slug }, params.updateData, {
      new: true,
    });
    revalidatePath("/manage/update");
    return {
      success: true,
      message: "Cập nhật sản phẩm thành công!",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getFeaturedProducts() {
  try {
    await connectToDatabase();
    const featuredProducts = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .lean();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(featuredProducts)),
    };
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
    return { success: false, message: "Không thể lấy sản phẩm nổi bật" };
  }
}

export async function deleteProductById(productId: string) {
  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(productId);
    return { success: true, message: "Sản phẩm đã được xóa thành công" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Đã xảy ra lỗi khi xóa sản phẩm" };
  }
}
