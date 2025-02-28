import UpdateProductList from "@/components/product/UpdateProductList";
import { getAllProducts } from "@/lib/actions/product.action";
import React from "react";

export const metadata = {
  title: "Cập nhật sản phẩm",
};

const page = async () => {
  const products = await getAllProducts();
  return (
    <div>
      <span className="font-bold text-2xl">Cập nhật sản phẩm</span>
      <UpdateProductList products={products ? products.data : []} />
    </div>
  );
};

export default page;
