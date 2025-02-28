import React from "react";
import Link from "next/link";
import { HomeIcon } from "../icons";

const Breadcrumb = ({
  categorySlug,
  subCategorySlug,
  productSlug,
  categoryTitle,
  subCategoryTitle,
  productTitle,
}: {
  categorySlug?: string;
  subCategorySlug?: string;
  productSlug?: string;
  categoryTitle?: string;
  subCategoryTitle?: string;
  productTitle?: string;
}) => {
  return (
    <nav className="flex mx-4 sm:mx-24 my-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="text-gray-700 hover:font-bold flex gap-2">
            <HomeIcon className="size-5" />
            Trang chủ
          </Link>
        </li>
        {categorySlug && (
          <li className="inline-flex items-center">
            <span className="mx-2">/</span>
            <Link
              href={`/${categorySlug}`}
              className="text-gray-700 hover:font-bold"
            >
              {categoryTitle}
            </Link>
          </li>
        )}
        {subCategorySlug && (
          <li className="inline-flex items-center">
            <span className="mx-2">/</span>
            <Link
              href={`/${categorySlug}/${subCategorySlug}`}
              className="text-gray-700 hover:font-bold"
            >
              {subCategoryTitle}
            </Link>
          </li>
        )}

        {/* Product */}
        {productSlug && (
          <li className="inline-flex items-center">
            <span className="mx-2">/</span>
            <span className="text-gray-700 hover:font-bold">
              {productTitle}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
