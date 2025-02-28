"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { DeleteIcon } from "../icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { IUser } from "@/database/user.model";
import { deleteUserById, updateUserRole } from "@/lib/actions/user.action";
import Image from "next/image";
import {
  SelectContent,
  SelectItem,
  SelectValue,
  Select,
  SelectTrigger,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

const ITEMS_PER_PAGE = 7;

const UserList = ({ users }: { users: IUser[] }) => {
  const router = useRouter();
  const [filter, setFilter] = useState(""); // Trạng thái để lọc theo tên
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // State lưu danh sách người dùng đã chọn

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa người dùng này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const response = await deleteUserById(userId);
      if (response && response.success) {
        Swal.fire("Đã xóa!", response.message, "success");
        router.refresh(); // Refresh the page to update the product list
      } else {
        Swal.fire("Lỗi!", response?.message || "Đã xảy ra lỗi", "error");
      }
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.clerkId));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return;

    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa các người dùng đã chọn?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const deletePromises = selectedUsers.map((userId) =>
        deleteUserById(userId)
      );
      await Promise.all(deletePromises);

      Swal.fire("Đã xóa!", "Các người dùng đã được xóa.", "success");
      setSelectedUsers([]);
      router.refresh();
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const response = await updateUserRole(userId, newRole);
    if (response && response.success) {
      Swal.fire("Thành công!", response.message, "success");
      router.refresh(); // Refresh the page to update the user list
    } else {
      Swal.fire("Lỗi!", response?.message || "Đã xảy ra lỗi", "error");
    }
  };

  const globalFilterFn = (
    row: { original: IUser },
    columnId: string,
    filterValue: string
  ) => {
    const name = row.original.name?.toLowerCase() || "";
    const email = row.original.email?.toLowerCase() || "";
    const searchValue = filterValue.toLowerCase();
    return name.includes(searchValue) || email.includes(searchValue);
  };

  const columns: ColumnDef<IUser>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={selectedUsers.length === users.length}
          onCheckedChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedUsers.includes(row.original.clerkId)}
          onCheckedChange={() => handleSelectUser(row.original.clerkId)}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Người dùng",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            width={50}
            height={50}
            alt="userAvatar"
            src={row.original.avatar}
            className="rounded-full"
          />
          <div>
            <h3 className="font-bold text-base">{row.original.name}</h3>
            <h4 className="text-sm text-slate-500">
              {new Date(row.original.created_at).toLocaleDateString("vi-VI")}
            </h4>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "role",
      cell: ({ row }) => (
        <Select
          value={row.original.role}
          onValueChange={(value) =>
            handleRoleChange(row.original.clerkId, value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={row.original.role} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <DeleteIcon
          className="size-5 hover:bg-slate-300 hover:rounded-lg cursor-pointer"
          onClick={() => handleDelete(row.original.clerkId)}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
    },
    globalFilterFn,
    initialState: {
      pagination: {
        pageSize: ITEMS_PER_PAGE, // Số sản phẩm mỗi trang
      },
    },
    onGlobalFilterChange: setFilter,
  });

  return (
    <div className="p-5">
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Tìm kiếm người dùng theo tên hoặc email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3"
        />
        {selectedUsers.length > 0 && (
          <Button variant="destructive" onClick={handleDeleteSelected}>
            Xóa {selectedUsers.length} người dùng
          </Button>
        )}
      </div>
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

export default UserList;
