import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { IProduct } from "@/database/product.model";
import { CartIcon, StarIcon } from "../icons";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { addToLocalCart } from "@/lib/actions/localCart.action";
import { addToCart } from "@/lib/actions/cart.action";

interface ProductItemProps {
  product: IProduct;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { userId } = useAuth();
  const { refreshCart } = useCart();
  const categorySlug = product.categorySlug;
  const subCategorySlug = product.subCategorySlug;
  const productSlug = product.slug;

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
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  return (
    <div
      key={product._id}
      className="flex flex-col bg-gray-50 border rounded-lg shadow-md p-4 transition-transform hover:scale-105 hover:shadow-lg duration-300"
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
          className="w-full h-60 object-cover rounded-md"
        />
      </Link>
      <span className="inline w-fit rounded-full bg-slate-200 px-2 py-1 text-sm mt-2">
        Trả góp 0%
      </span>
      <div className="flex flex-col flex-grow mt-3">
        {product.sale_price ? (
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm mt-1 line-through">
              {product.price ? `${product.price.toLocaleString()}đ` : "Liên hệ"}
            </span>
            <span className="text-primary font-semibold text-lg mt-1">
              {product.price
                ? `${product.sale_price.toLocaleString()}đ`
                : "Liên hệ"}
            </span>
            <span className="text-[#04966A] text-sm">
              Giảm {(product.price - product.sale_price).toLocaleString()} đ{" "}
            </span>
          </div>
        ) : (
          <span className="text-primary font-semibold text-lg mt-1">
            {product.price ? `${product.price.toLocaleString()}đ` : "Liên hệ"}
          </span>
        )}
        <h3 className="text-base text-gray-900 line-clamp-3">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-slate-200 rounded-full px-2 font-bold text-sm">
            {product.capacity}
          </span>
          <span className="bg-slate-200 rounded-full px-2 font-bold text-sm">
            {product.screen}
          </span>
          <span className="bg-slate-200 rounded-full px-2 font-bold text-sm">
            {product.card && product.card}
          </span>
        </div>
        <span className="flex items-center gap-1 mt-2">
          <StarIcon className="size-5" />
          {product.rating.reduce((a, b) => a + b, 0) / product.rating.length}
        </span>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <Button
            className="bg-primary rounded-lg p-3 cursor-pointer hover:bg-opacity-80"
            onClick={handleAddToCart}
          >
            <CartIcon className="size-5 " />
          </Button>

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
};

export default ProductItem;
