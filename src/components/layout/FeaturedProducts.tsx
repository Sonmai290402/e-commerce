"use client";

import { useEffect, useState } from "react";
import { getFeaturedProducts } from "@/lib/actions/product.action";
import Image from "next/image";
import Link from "next/link";
import { TFeaturedProductProps } from "@/types";
import { Button } from "../ui/button";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<TFeaturedProductProps[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getFeaturedProducts();
      if (res.success) {
        setProducts(res.data);
      }
    };
    fetchProducts();
  }, []);

  if (!products.length) {
    return (
      <p className="text-center text-gray-500">Đang tải sản phẩm nổi bật...</p>
    );
  }

  return (
    <div className="mx-4 sm:mx-24 my-5 max-w-7xl bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Sản phẩm nổi bật
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const categorySlug = product.categorySlug;
          const subCategorySlug = product.subCategorySlug;
          const productSlug = product.slug;

          return (
            <div
              key={product._id}
              className="flex flex-col bg-gray-50 border rounded-lg shadow-md p-4 transition-transform hover:scale-105 hover:shadow-xl duration-300"
            >
              <Link
                href={`/${categorySlug}/${subCategorySlug}/${productSlug}`}
                className="block"
              >
                <Image
                  src={product.image || "/placeholder.jpg"}
                  alt={product.title}
                  width={300}
                  height={200}
                  className="w-full h-56 object-cover rounded-md"
                />
              </Link>

              <div className="flex flex-col flex-grow mt-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-3">
                  {product.title}
                </h3>

                <div className="mt-auto pt-4 flex flex-col gap-2">
                  {product.sale_price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm mt-1 line-through">
                        {product.price
                          ? `${product.price.toLocaleString()}đ`
                          : "Liên hệ"}
                      </span>
                      <span className="text-primary font-semibold text-lg mt-1">
                        {product.price
                          ? `${product.sale_price.toLocaleString()}đ`
                          : "Liên hệ"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-primary font-semibold text-lg mt-1">
                      {product.price
                        ? `${product.price.toLocaleString()}đ`
                        : "Liên hệ"}
                    </span>
                  )}
                  <Link
                    href={`/${categorySlug}/${subCategorySlug}/${productSlug}`}
                    className="block w-full"
                  >
                    <Button className="w-full bg-primary text-white rounded-lg py-2">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
