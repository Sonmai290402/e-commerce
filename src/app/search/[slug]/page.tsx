"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import React, { useState } from "react";
import useSWR from "swr";
import { IProduct } from "@/database/product.model";
import Link from "next/link";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SearchPage = ({ params }: { params: { slug: string } }) => {
  const query = params.slug;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error } = useSWR(`/api/search?q=${query}`, fetcher);

  const products: IProduct[] = data?.success ? data.data : [];
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error)
    return <p className="text-center text-gray-500">Lỗi khi tải dữ liệu.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-5">Kết quả tìm kiếm</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => (
              <Link
                key={product._id}
                href={`/${product.categorySlug}/${product.subCategorySlug}/${product.slug}`}
              >
                <div className="border p-4 rounded-lg hover:shadow-lg transition">
                  <Image
                    src={product.image}
                    width={300}
                    height={400}
                    alt={product.title}
                    className="w-full h-60 object-cover rounded"
                  />
                  <h3 className="text-lg font-semibold mt-2">
                    {product.title}
                  </h3>
                  <div className="mt-2">
                    {product.sale_price ? (
                      <div className="flex items-center gap-2">
                        <p className="text-base text-primary">
                          {product.sale_price.toLocaleString()}đ
                        </p>
                        <p className="line-through text-base text-gray-500">
                          {product.price.toLocaleString()}đ
                        </p>
                      </div>
                    ) : (
                      <p className="text-base text-primary">
                        {product.price.toLocaleString()}đ
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Không tìm thấy sản phẩm nào.
          </p>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <Pagination className="mt-6 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={`cursor-pointer hover:border hover:border-gray-300 ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
                  className={` cursor-pointer hover:border hover:border-gray-300 ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
