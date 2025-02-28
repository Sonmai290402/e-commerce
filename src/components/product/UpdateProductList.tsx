"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "../icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { deleteProductById } from "@/lib/actions/product.action";
import { IProduct } from "@/database/product.model";
import { Checkbox } from "../ui/checkbox";

const ITEMS_PER_PAGE = 7;

const UpdateProductList = ({ products }: { products: IProduct[] }) => {
  const router = useRouter();
  const [filter, setFilter] = useState(""); // Trạng thái để lọc theo tên
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // State lưu danh sách sản phẩm đã chọn

  const handleSelectProduct = (_id: string) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(_id)
        ? prevSelected.filter((_id) => _id !== _id)
        : [...prevSelected, _id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return;

    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const deletePromises = selectedProducts.map((_id) =>
        deleteProductById(_id)
      );
      await Promise.all(deletePromises);

      Swal.fire("Đã xóa!", "Các sản phẩm đã được xóa.", "success");
      setSelectedProducts([]);
      router.refresh();
    }
  };

  // Cấu hình cột cho DataTable
  const columns: ColumnDef<IProduct>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={selectedProducts.length === products.length}
          onCheckedChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedProducts.includes(row.original._id)}
          onCheckedChange={() => handleSelectProduct(row.original._id)}
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Sản phẩm",
      cell: ({ row }) => (
        <div>
          <h3
            onClick={() => router.push(`/manage/update/${row.original.slug}`)}
            className={`font-bold text-base hover:underline cursor-pointer ${
              row.original.isFeatured ? "text-primary" : ""
            }`}
          >
            {row.original.title}
          </h3>
          <h4 className="text-sm text-slate-500">
            {new Date(row.original.created_at).toLocaleDateString("vi-VI")}
          </h4>
        </div>
      ),
    },
    {
      accessorKey: "categorySlug",
      header: "Danh mục",
    },
    {
      accessorKey: "subCategorySlug",
      header: "Danh mục con",
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => (
        <div>
          {row.original.sale_price ? (
            <>
              <h3 className="text-base font-bold">
                {row.original.sale_price.toLocaleString()}đ
              </h3>
              <h4 className="line-through text-sm">
                {row.original.price.toLocaleString()}đ
              </h4>
            </>
          ) : (
            <h3 className="text-base font-bold">
              {row.original.price.toLocaleString()}đ
            </h3>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <DeleteIcon
          className="size-5 hover:bg-slate-300 hover:rounded-lg cursor-pointer"
          onClick={() => handleDelete(row.original._id)}
        />
      ),
    },
  ];

  // Hàm xóa sản phẩm
  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const response = await deleteProductById(productId);
      if (response.success) {
        Swal.fire("Đã xóa!", response.message, "success");
        router.refresh();
      } else {
        Swal.fire("Lỗi!", response.message, "error");
      }
    }
  };

  // Tạo bảng dữ liệu
  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
    },
    initialState: {
      pagination: {
        pageSize: ITEMS_PER_PAGE, // Số sản phẩm mỗi trang
      },
    },
    onGlobalFilterChange: setFilter,
  });

  return (
    <div className="p-5">
      {/* Ô tìm kiếm sản phẩm */}
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3"
        />
        {selectedProducts.length > 0 && (
          <Button variant="destructive" onClick={handleDeleteSelected}>
            Xóa {selectedProducts.length} sản phẩm
          </Button>
        )}
      </div>

      {/* Bảng sản phẩm */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Không có sản phẩm nào!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Phân trang */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Trước
        </Button>
        <div className="flex gap-2">
          {Array.from({ length: table.getPageCount() }, (_, index) => (
            <Button
              key={index}
              variant={
                table.getState().pagination.pageIndex === index
                  ? "default"
                  : "outline"
              }
              onClick={() => table.setPageIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Tiếp
        </Button>
      </div>
    </div>
  );
};

export default UpdateProductList;
