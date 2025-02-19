import { ProductManage, TagIcon, UserManage } from "@/components/icons";
import { TMenuItem } from "@/types";
import React from "react";

export const menuItems: TMenuItem[] = [
  {
    url: "/manage/product",
    title: "Quản lý sản phẩm",
    icon: <ProductManage className="size-5" />,
  },
  {
    url: "/manage/category",
    title: "Quản lý danh mục",
    icon: <TagIcon className="size-5" />,
  },
  {
    url: "/manage/subcategory",
    title: "Quản lý danh mục con",
    icon: <TagIcon className="size-5" />,
  },
  {
    url: "/manage/user",
    title: "Quản lý người dùng",
    icon: <UserManage className="size-5" />,
  },
];
