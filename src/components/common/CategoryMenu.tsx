"use client";
import React, { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { getCategories } from "@/lib/actions/category.action";
import { getSubCategories } from "@/lib/actions/subCategory.action";
import { BarIcon } from "../icons";

// Fetcher function cho SWR
const fetchCategories = async () => {
  const data = await getCategories();
  return data || [];
};

const fetchSubCategories = async (categoryId: string) => {
  const data = await getSubCategories(categoryId);
  return data || [];
};

const CategoryMenu = () => {
  const { data: categories = [] } = useSWR("categories", fetchCategories);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  let menuTimeout: NodeJS.Timeout;

  const { data: subCategories = [], mutate } = useSWR(
    hoveredCategory ? `subCategories-${hoveredCategory}` : null,
    () => fetchSubCategories(hoveredCategory!),
    { revalidateOnFocus: false }
  );

  return (
    <div
      className="relative text-black cursor-pointer"
      onMouseEnter={() => {
        clearTimeout(menuTimeout);
        setShowMenu(true);
      }}
      onMouseLeave={() => {
        menuTimeout = setTimeout(() => {
          setShowMenu(false);
          setHoveredCategory(null);
        }, 300); // Độ trễ 300ms để tránh mất menu ngay lập tức
      }}
    >
      {/* Nút mở menu */}
      <div className="flex gap-2 px-3 py-2 rounded-full bg-black bg-opacity-30 text-white">
        <BarIcon />
        <p className="font-bold hidden sm:inline">Danh mục</p>
      </div>

      {/* Danh mục cấp 1 */}
      {showMenu && categories.length > 0 && (
        <div className="absolute left-0 mt-1 top-full bg-white shadow-lg rounded-lg w-64">
          {categories.map((category) => (
            <div
              key={category._id}
              className="relative group"
              onMouseEnter={() => {
                setHoveredCategory(category._id);
                mutate(); // Fetch danh mục con nếu chưa có
              }}
            >
              <Link
                href={`/${category.slug}`}
                className="block p-3 hover:bg-gray-100"
              >
                {category.title}
              </Link>

              {/* Danh mục cấp 2 */}
              {hoveredCategory === category._id && subCategories && (
                <div className="absolute left-full top-0 ml-2 bg-white shadow-lg rounded-lg w-64">
                  {subCategories.map(
                    (subCategory: {
                      _id: string;
                      slug: string;
                      title: string;
                    }) => (
                      <Link
                        key={subCategory._id}
                        href={`/${category.slug}/${subCategory.slug}`}
                        className="block p-3 hover:bg-gray-100"
                      >
                        {subCategory.title}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
