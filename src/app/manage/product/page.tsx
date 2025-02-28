import CreateNewProduct from "@/components/product/CreateNewProduct";
import React from "react";

export const metadata = {
  title: "Quản lý sản phẩm",
};

const page = () => {
  return (
    <div>
      <span className="text-2xl font-bold">Thêm sản phẩm mới</span>
      <CreateNewProduct />
    </div>
  );
};

export default page;
