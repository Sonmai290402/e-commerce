"use client";
import React, { useEffect, useState } from "react";
import CategoryItem from "../common/CategoryItem";
import { getCategories } from "@/lib/actions/category.action";
import { getAllSubCategories } from "@/lib/actions/subCategory.action";
import { TCategoryItemProps } from "@/types";

const CategoryGrid = () => {
  const [categories, setCategories] = useState<TCategoryItemProps[]>([]);
  const [subCategories, setSubCategories] = useState<TCategoryItemProps[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Lấy danh mục chính
        const categoriesData = await getCategories(true);
        const formattedCategories: TCategoryItemProps[] = categoriesData.map(
          (category) => ({
            _id: category._id,
            title: category.title,
            slug: category.slug,
            image: category.image ?? "",
            isSubCategory: false,
          })
        );
        setCategories(formattedCategories);

        // Lấy danh mục con
        const subCategoriesData = await getAllSubCategories();
        const formattedSubCategories: TCategoryItemProps[] =
          subCategoriesData.map((sub) => ({
            _id: sub._id,
            title: sub.title,
            image: sub.image ?? "",
            slug: sub.slug,
            categorySlug: sub.categorySlug, // Nhận từ API
            isSubCategory: true,
          }));
        setSubCategories(formattedSubCategories);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục và danh mục con:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="mx-4 sm:mx-24 my-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Hiển thị danh mục chính */}
      {categories.map((category, index) => (
        <CategoryItem
          key={index}
          title={category.title}
          image={category.image}
          slug={category.slug}
          isSubCategory={false}
        />
      ))}

      {/* Hiển thị danh mục con */}
      {subCategories.map((sub, index) => (
        <CategoryItem
          key={index}
          title={sub.title}
          image={sub.image}
          slug={sub.slug}
          categorySlug={sub.categorySlug}
          isSubCategory={true}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
