"use server";
import Product from "@/database/product.modal";
import { TCreateProductParams } from "@/types";
import { connectToDatabase } from "../mongoose";
// fetching
export async function getProductBySlug({ slug }: { slug: string }) {
  try {
    connectToDatabase();
    const findProduct = await Product.findOne({ slug });
    return findProduct;
  } catch (error) {
    console.log(error);
  }
}
// CRUD
export async function createProduct(params: TCreateProductParams) {
  try {
    connectToDatabase();
    const existedProduct = await Product.findOne({ slug: params.slug });
    if (existedProduct) {
      return {
        success: false,
        message: "Sản phẩm đã tồn tại",
      };
    }

    const product = await Product.create(params);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.log(error);
  }
}
