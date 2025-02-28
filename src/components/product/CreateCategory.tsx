"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/lib/actions/category.action";
import { toast } from "react-toastify";
import slugify from "slugify";

const CreateCategory = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên danh mục!");
      return;
    }
    setLoading(true);

    const res = await createCategory(
      title,
      image,
      slugify(title, { lower: true, locale: "vi" })
    );

    setLoading(false);
    if (res.success) {
      toast.success("Thêm danh mục thành công!");
      setTitle("");
      setImage("");
    } else {
      toast.error(res.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 items-center mt-5 w-96 mx-auto"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tên danh mục"
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
        {loading ? "Đang thêm..." : "Thêm danh mục"}
      </Button>
    </form>
  );
};

export default CreateCategory;
