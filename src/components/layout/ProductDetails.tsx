"use client";
import React from "react";
import { getProductBySlug } from "@/lib/actions/product.action";
import Image from "next/image";
import { CardIcon, ChipIcon, ScreenIcon, StarIcon } from "../icons";
import { toast } from "react-toastify";
import { addToCart, fetchCart } from "@/lib/actions/cart.action";
import useSWR from "swr";
import { addToLocalCart } from "@/lib/actions/localCart.action";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "../context/CartContext";

const ProductDetails = ({ productSlug }: { productSlug: string }) => {
  const { userId } = useAuth();
  const { refreshCart } = useCart();

  const { data: product, error } = useSWR(
    productSlug ? `/api/products/${productSlug}` : null,
    () => getProductBySlug({ slug: productSlug })
  );

  if (error)
    return <p className="text-center text-red-500">Lỗi tải sản phẩm.</p>;
  if (!product) return <p className="text-center text-gray-500">Đang tải...</p>;

  const handleAddToCart = async () => {
    try {
      if (!userId) {
        addToLocalCart({
          _id: product._id,
          name: product.title,
          price: product.price,
          sale_price: product.sale_price,
          categorySlug: product.categorySlug,
          subCategorySlug: product.subCategorySlug,
          productSlug: product.slug,
          quantity: 1,
        });
      }
      addToCart({
        _id: product._id,
        name: product.title,
        price: product.price,
        sale_price: product.sale_price,
        categorySlug: product.categorySlug,
        subCategorySlug: product.subCategorySlug,
        productSlug: product.slug,
        quantity: 1,
      });

      refreshCart(); // Cập nhật lại giỏ hàng

      console.log("Dữ liệu giỏ hàng sau khi thêm:", await fetchCart());
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  return (
    <div className="mx-24 my-5 grid grid-cols-2 gap-5">
      <div className="mx-auto">
        <div className="p-5">
          <Image
            src={product.image}
            width={400}
            height={300}
            alt="Product Image"
          ></Image>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-lg text-center">Thông số</h4>
          <div className="flex flex-col gap-3">
            <div className="flex bg-gray-200 p-3 justify-between rounded-lg items-center">
              <div className="flex flex-col">
                <p>Chip</p>
                <p className="font-bold">{product.chip}</p>
              </div>
              <ChipIcon className="size-7" />
            </div>
            <div className="flex bg-gray-200 p-3 justify-between rounded-lg items-center">
              <div className="flex flex-col">
                <p>Kích thước màn hình</p>
                <p className="font-bold">{product.screen}</p>
              </div>
              <ScreenIcon className="size-7" />
            </div>
            {product.categorySlug === "dien-thoai" ? (
              <div className="flex bg-gray-200 p-3 justify-between rounded-lg items-center">
                <div className="flex flex-col">
                  <p>Kích thước thiết bị</p>
                  <p className="font-bold">{product.size}</p>
                </div>
                <ScreenIcon className="size-7" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex bg-gray-200 p-3 justify-between rounded-lg items-center">
                  <div className="flex flex-col">
                    <p>RAM</p>
                    <p className="font-bold">{product.ram}</p>
                  </div>
                  <ChipIcon className="size-7" />
                </div>
                <div className="flex bg-gray-200 p-3 justify-between rounded-lg items-center">
                  <div className="flex flex-col">
                    <p>Card đồ hoạ</p>
                    <p className="font-bold">{product.card}</p>
                  </div>
                  <CardIcon className="size-7" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-3xl font-bold">{product.title}</h3>

        <div className="flex">
          <StarIcon className="size-5" /> {product.rating} | {product.views}{" "}
          lượt xem
        </div>

        <div className="flex gap-10 font-semibold items-center">
          <p>Dung lượng</p>
          <div className="border rounded-lg p-3 bg-white">
            {product.capacity}
          </div>
        </div>
        <div className="bg-gradient-to-b from-yellow-200 white p-3 rounded-lg border border-yellow-300">
          <p className="text-gray-600">Mua ngay với giá</p>
          {product.sale_price ? (
            <div>
              <div className="text-2xl font-bold">
                {product.sale_price.toLocaleString()}đ
              </div>
              <div className="flex gap-1">
                <div className="line-through">
                  {product.price.toLocaleString()}đ
                </div>
                <div className="text-red-600">
                  {Math.ceil(
                    ((product.price - product.sale_price) / product.price) * 100
                  )}
                  %
                </div>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold">
              {product.price.toLocaleString()}đ
            </div>
          )}
        </div>

        <div
          className="p-3 bg-primary text-center text-white rounded-lg cursor-pointer hover:opacity-80"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </div>

        <div className="rounded-lg border">
          <p className="p-3 font-bold rounded-t-lg bg-gray-200">
            Thu máy cũ, lên đời máy mới
          </p>
          <div className="p-3 flex flex-col gap-3">
            <p>Thủ tục đơn giản - Trợ giá cao nhất thị trường</p>
            <div className="p-2 rounded-lg border border-gray-300">
              <p className="text-gray-500 text-sm">Đổi máy cũ giảm thêm</p>
              <p className="font-bold">1,000,000đ</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg">
          <p className="p-3 font-bold rounded-t-lg bg-gray-200">
            Quà tặng và ưu đãi khác
          </p>
          <div className="p-2 border border-gray-300 rounded-b-lg">
            <p className="text-sm">
              Tặng phiếu mua hàng 50,000đ khi mua sim kèm máy
            </p>
            <p className="text-sm">
              Trả góp 0% lãi suất, MIỄN PHÍ chuyển đổi kì hạn 3 - 6 tháng qua
              thẻ tín dụng
            </p>
            <p className="text-sm">
              Tặng mã ưu đãi giảm ngay 3% khi mua Máy tính bảng, Đồng hồ thông
              minh, Điện máy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
