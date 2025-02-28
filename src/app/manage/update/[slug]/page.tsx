import UpdateProduct from "@/components/product/UpdateProduct";
import { getProductBySlug } from "@/lib/actions/product.action";
import React from "react";

export const metadata = {
  title: "Cập nhật sản phẩm",
};

const page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  if (!slug) {
    return <div>Không tìm thấy sản phẩm!</div>;
  }
  const product = await getProductBySlug({ slug });
  return (
    <div>
      <UpdateProduct data={JSON.parse(JSON.stringify(product))} />
    </div>
  );
};

export default page;
