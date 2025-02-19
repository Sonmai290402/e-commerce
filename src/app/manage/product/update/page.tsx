import ProductUpdate from "@/components/product/ProductUpdate";

const page = ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  return (
    <div>
      <div className="mb-8 text-2xl font-bold">Cập nhật sản phẩm</div>
      <ProductUpdate />
    </div>
  );
};

export default page;
