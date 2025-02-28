"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { getAllProducts } from "@/lib/actions/product.action";
import ProductItem from "../common/ProductItem";
import Filter from "../common/Filter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SkeletonLoading from "../common/SkeletonLoading";

const ITEMS_PER_PAGE = 8;

const fetcher = async () => {
  const res = await getAllProducts();
  if (res?.success && Array.isArray(res.data)) {
    return res.data;
  }
  throw new Error("Lỗi khi fetch dữ liệu");
};

const ProductList = ({
  categorySlug,
  subCategorySlug,
}: {
  categorySlug?: string;
  subCategorySlug?: string;
}) => {
  const { data: products = [], error, isLoading } = useSWR("products", fetcher);
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // Lọc sản phẩm theo danh mục và sắp xếp
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (categorySlug) {
      filtered = filtered.filter(
        (product) => product.categorySlug === categorySlug
      );
    }
    if (subCategorySlug) {
      filtered = filtered.filter(
        (product) => product.subCategorySlug === subCategorySlug
      );
    }
    if (filter === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (filter === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, categorySlug, subCategorySlug, filter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error)
    return <p className="text-center text-red-500">Lỗi khi tải sản phẩm.</p>;
  if (isLoading)
    return (
      <div>
        <SkeletonLoading />
      </div>
    );

  return (
    <div className="mx-4 sm:mx-24 my-5">
      <Filter
        onFilterChange={(selectedFilter) => {
          setFilter(selectedFilter);
          setCurrentPage(1); // Reset trang khi lọc
        }}
      />

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          Không tìm thấy sản phẩm nào.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <Pagination className="mt-6 flex justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`cursor-pointer ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:border hover:border-gray-300"
                    }`}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className="cursor-pointer hover:border hover:border-gray-300"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`cursor-pointer ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:border hover:border-gray-300"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
