import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/actions/user.action";
import { EUserRole } from "@/types/enums";
import NotFoundPage from "../not-found";
import Sidebar from "@/components/layout/Sidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  const user = await getUserInfo({ userId });
  if (user && user.role !== EUserRole.ADMIN) return <NotFoundPage />;

  return (
    <div className="wrapper !bg-white grid grid-cols-[300px,minmax(0,1fr)] h-full">
      <Sidebar />
      <div className="p-5">{children}</div>
    </div>
  );
};

export default AdminLayout;
