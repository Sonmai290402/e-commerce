"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/lib/actions/category.action";
import { toast } from "react-toastify";

const CreateCategory = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên danh mục!");
      return;
    }

    const res = await createCategory(title, image);
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
      <Button type="submit" className="w-full">
        Thêm danh mục
      </Button>
    </form>
  );
};

export default CreateCategory;
