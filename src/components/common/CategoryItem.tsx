"use client";
import Image from "next/image";
import Link from "next/link";
import { TCategoryItemProps } from "@/types";

const CategoryItem = ({
  title,
  image,
  slug,
  isSubCategory,
  categorySlug,
}: TCategoryItemProps) => {
  // Kiểm tra nếu là danh mục con thì ghép cả categorySlug
  const linkHref =
    isSubCategory && categorySlug ? `/${categorySlug}/${slug}` : `/${slug}`;

  return (
    <div className="rounded-lg shadow-lg p-4 flex flex-col items-center bg-white">
      <Link href={linkHref} className="w-full h-40 md:h-48 lg:h-52 relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </Link>
      <h3 className="text-lg font-semibold mt-3 text-center">{title}</h3>
    </div>
  );
};

export default CategoryItem;
