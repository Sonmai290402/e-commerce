"use client";
import Link from "next/link";
import { BarIcon, SearchIcon, CartIcon, AdjustIcon, UserIcon } from "../icons";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/actions/user.action";

const Header = () => {
  const { userId } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (userId) {
        // Replace this with your actual function to get the user's role
        const role = await getUserRole(userId);
        setUserRole(role);
      }
    }
    fetchUserRole();
  }, [userId]);

  return (
    <div className="h-[100px] w-full bg-primary sticky">
      <div className="header-main h-full flex items-center justify-between mx-24 text-white ">
        <div className="left-group flex items-center gap-3">
          <Link href="/" className="logo cursor-pointer">
            <span className="font-bold text-3xl">LOGO</span>
          </Link>
          <div className="category flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-black bg-opacity-30">
            <BarIcon />
            <span className="text-lg font-semibold">Danh mục</span>
          </div>
        </div>

        <div className="search-bar flex items-center relative w-[570px]">
          <input
            type="text"
            placeholder="Nhập tên điện thoại, máy tính, phụ kiện,... cần tìm"
            className="rounded-full w-full py-3 px-5 outline-none text-black"
          />
          <button className="p-1 rounded-full absolute right-3 transform bg-primary bg-opacity-20 text-primary">
            <SearchIcon />
          </button>
        </div>

        <div className="right-group flex items-center gap-3">
          <div className="profile-button flex items-center p-2 bg-black bg-opacity-30 rounded-full">
            {!userId ? (
              <Link href="/sign-in">
                <UserIcon />
              </Link>
            ) : (
              <UserButton />
            )}
          </div>

          {userRole === "ADMIN" && (
            <Link
              href="/manage/product"
              className="manage p-2 bg-black bg-opacity-30 rounded-full"
            >
              <AdjustIcon />
            </Link>
          )}

          <div className="cart flex gap-2 px-3 py-2 rounded-full bg-black bg-opacity-30">
            <CartIcon />
            <span className="text-lg font-semibold">Giỏ hàng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
