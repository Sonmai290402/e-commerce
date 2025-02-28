"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSubCategory } from "@/lib/actions/subCategory.action";
import { toast } from "react-toastify";
import slugify from "slugify";
import useSWR from "swr";
import { getCategories } from "@/lib/actions/category.action";

export default function CreateSubCategory() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: categories = [] } = useSWR("categories", getCategories);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !categoryId) {
      toast.error("Vui lòng nhập đủ thông tin!");
      return;
    }
    setLoading(true);

    try {
      const res = await createSubCategory({
        title,
        slug: slugify(title, { lower: true, locale: "vi" }),
        categoryId,
        image,
      });

      setLoading(false);
      if (res.success) {
        toast.success("Thêm danh mục con thành công!");
        setTitle("");
        setCategoryId("");
        setImage("");
      } else {
        toast.error(res.message);
      }
    } catch {
      setLoading(false);
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
      <Button
        variant="default"
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Đang thêm..." : "Thêm danh mục con"}
      </Button>
    </form>
  );
}
