"use client";
import Image from "next/image";
import { TCategoryItemProps } from "@/types";

const CategoryItem = ({ title, image }: TCategoryItemProps) => {
  return (
    <div className="rounded-lg shadow-lg p-4 flex flex-col items-center bg-white">
      <div className="w-full h-40 md:h-48 lg:h-52 relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold mt-3 text-center">{title}</h3>
    </div>
  );
};

export default CategoryItem;
