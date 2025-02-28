import UserList from "@/components/user/UserList";
import { getAllUsers } from "@/lib/actions/user.action";
import React from "react";

export const metadata = {
  title: "Quản lý người dùng",
};

const page = async () => {
  const users = await getAllUsers();
  return (
    <div>
      <UserList users={users ? JSON.parse(JSON.stringify(users)) : []} />
    </div>
  );
};

export default page;
