import CreateSubCategory from "@/components/product/CreateSubCategory";

export const metadata = {
  title: "Quản lý danh mục con",
};

const page = () => {
  return (
    <div>
      <span className="mb-5 text-2xl font-bold">Thêm danh mục con mới</span>
      <CreateSubCategory />
    </div>
  );
};

export default page;
