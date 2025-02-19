import CreateNewProduct from "@/components/product/CreateNewProduct";
import React from "react";

const page = () => {
  return (
    <div>
      <span className="text-2xl font-bold">Thêm sản phẩm mới</span>
      <CreateNewProduct />
    </div>
  );
};

export default page;
