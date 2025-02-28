"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { removeCartItem, updateCartItem } from "@/lib/actions/cart.action";
import { useAuth } from "@clerk/nextjs";
import {
  removeLocalCartItem,
  updateLocalCartItem,
} from "@/lib/actions/localCart.action";
import { DeleteIcon } from "@/components/icons";

const CartPage = () => {
  const { items = [], isLoading } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    document.title = "Giỏ hàng";
  }, []);

  useEffect(() => {
    // Cập nhật selectedItems nếu giỏ hàng thay đổi
    setSelectedItems((prevSelected) =>
      prevSelected.filter((_id) => items.some((item) => item._id === _id))
    );
  }, [items]);

  if (isLoading) {
    return <p className="text-center mt-10">Đang tải giỏ hàng...</p>;
  }

  // Toggle chọn tất cả sản phẩm
  const toggleSelectAll = () => {
    if (items.length === 0) return;
    setSelectedItems(
      selectedItems.length === items.length ? [] : items.map((item) => item._id)
    );
  };

  // Toggle chọn sản phẩm riêng lẻ
  const toggleSelectItem = (_id: string) => {
    setSelectedItems((prev) =>
      prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id]
    );
  };

  // Tính tổng tiền
  const totalAmount = items
    .filter((item) => selectedItems.includes(item._id))
    .reduce(
      (sum, item) => sum + (item.sale_price ?? item.price) * item.quantity,
      0
    );
  const handleRemoveSelectedItems = async () => {
    if (selectedItems.length === 0) return;

    if (userId) {
      // Xóa trên server
      await Promise.all(selectedItems.map((id) => removeCartItem(id)));
    } else {
      // Xóa trong local storage
      selectedItems.forEach((id) => removeLocalCartItem(id));
    }

    // Cập nhật state
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-5">
        <div className="flex justify-between px-0 sm:px-2">
          <h2 className="text-2xl font-bold mb-5">Giỏ hàng</h2>
          <Button
            variant="destructive"
            className={`${
              selectedItems.length > 0 ? "" : "hidden"
            } text-base hover:opacity-80 w-fit rounded-lg`}
            onClick={handleRemoveSelectedItems}
          >
            <DeleteIcon className="size-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">
            Giỏ hàng của bạn đang trống.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={
                        selectedItems.length > 0 &&
                        selectedItems.length === items.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead className="text-right">Tổng</TableHead>
                  <TableHead className="text-right">Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item._id)}
                        onCheckedChange={() => toggleSelectItem(item._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/${item.categorySlug}/${item.subCategorySlug}/${item.productSlug}`}
                        className="cursor-pointer hover:font-semibold"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {(item.sale_price ?? item.price).toLocaleString()}đ
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            userId
                              ? updateCartItem(item._id, "decrease")
                              : updateLocalCartItem(item._id, "decrease")
                          }
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            userId
                              ? updateCartItem(item._id, "increase")
                              : updateLocalCartItem(item._id, "increase")
                          }
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (item.sale_price ?? item.price) * item.quantity
                      ).toLocaleString()}
                      đ
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          userId
                            ? removeCartItem(item._id)
                            : removeLocalCartItem(item._id)
                        }
                      >
                        <DeleteIcon className="size-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Tổng thanh toán */}
            <div className="mt-5 flex justify-end gap-2">
              <p className="text-2xl font-bold">Tổng tiền:</p>
              <p className="text-primary text-2xl font-bold">
                {totalAmount.toLocaleString()}đ
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="default"
                className="mt-3 text-xl hover:opacity-80 w-fit rounded-lg"
              >
                Thanh toán
              </Button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
