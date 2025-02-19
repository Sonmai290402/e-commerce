"use client";
import React, { useEffect, useState } from "react";
import CategoryItem from "../common/CategoryItem";
import { getCategories } from "@/lib/actions/category.action";
import { getAllSubCategories } from "@/lib/actions/subCategory.action";

const CategoryGrid = () => {
  const [items, setItems] = useState<
    { _id: string; title: string; image: string; type: string }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Lấy danh mục chính
        const categories = await getCategories(true);
        const formattedCategories = categories.map((category) => ({
          _id: category._id,
          title: category.title,
          image: category.image ?? "", // Nếu không có hình ảnh, để trống
          type: "category", // Đánh dấu đây là danh mục chính
        }));

        // Lấy danh mục con
        const subCategories = await getAllSubCategories();
        const formattedSubCategories = subCategories.map((sub) => ({
          _id: sub._id,
          title: sub.title,
          image: sub.image ?? "",
          type: "subCategory",
        }));

        // Gộp cả hai danh sách
        setItems([...formattedCategories, ...formattedSubCategories]);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục và danh mục con:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="mx-24 cursor-pointer">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {items.map((item) => (
          <CategoryItem key={item._id} title={item.title} image={item.image} />
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
