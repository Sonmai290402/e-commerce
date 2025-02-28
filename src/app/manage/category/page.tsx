import CreateCategory from "@/components/product/CreateCategory";

export const metadata = {
  title: "Quản lý danh mục",
};

const page = () => {
  return (
    <div>
      <span className="text-2xl font-bold">Thêm danh mục mới</span>
      <CreateCategory />
    </div>
  );
};

export default page;
