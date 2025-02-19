"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSubCategory } from "@/lib/actions/subCategory.action";
import { getCategories } from "@/lib/actions/category.action";
import { toast } from "react-toastify";

export default function CreateSubCategory() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<
    { _id: string; title: string }[]
  >([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        setCategories(res || []);
      } catch {
        console.error("Lỗi khi lấy danh mục");
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !categoryId) {
      toast.error("Vui lòng nhập đủ thông tin!");
      return;
    }

    try {
      const res = await createSubCategory({ title, categoryId, image });
      if (res.success) {
        toast.success("Thêm danh mục con thành công!");
        setTitle("");
        setCategoryId("");
        setImage("");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi thêm danh mục con.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mt-5 w-96 mx-auto"
    >
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">Chọn danh mục</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.title}
          </option>
        ))}
      </select>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tên danh mục con"
      />
      <Input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="URL hình ảnh"
      />
      <Button type="submit" className="w-full">
        Thêm
      </Button>
    </form>
  );
}
