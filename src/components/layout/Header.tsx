"use client";
import Link from "next/link";
import { CartIcon, AdjustIcon, UserIcon } from "../icons";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/actions/user.action";
import { useCart } from "../context/CartContext";
import CategoryMenu from "../common/CategoryMenu";
import Search from "../common/Search";

const Header = () => {
  const { userId } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const { items = [] } = useCart(); // Lấy state từ CartContext
  console.log(" Header ~ items:", items);

  useEffect(() => {
    async function fetchUserRole() {
      if (userId) {
        const role = await getUserRole(userId);
        setUserRole(role);
      }
    }
    fetchUserRole();
  }, [userId]);

  return (
    <div className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="header-main flex items-center justify-between sm:mx-24 mx-4 text-white py-3">
        <div className="left-group flex items-center gap-3">
          <Link href="/" className="logo cursor-pointer">
            <span className="font-bold text-3xl">LOGO</span>
          </Link>
          <CategoryMenu />
        </div>

        <Search />

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
              className="manage p-2 bg-black bg-opacity-30 rounded-full hover:opacity-85 transition"
            >
              <AdjustIcon />
            </Link>
          )}

          <Link
            href="/cart"
            className="cart flex gap-2 px-3 py-2 rounded-full bg-black bg-opacity-30 relative hover:opacity-85"
          >
            <CartIcon />
            <span className="hidden sm:inline text-lg font-semibold">
              Giỏ hàng
            </span>

            <span className="bg-yellow-200 text-primary rounded-full absolute top-0 right-0 translate-x-0.5 -translate-y-1/3 w-5 h-5 flex items-center justify-center text-xs font-semibold">
              {items.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
