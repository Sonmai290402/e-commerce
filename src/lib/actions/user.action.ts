"use server";

import User, { IUser } from "@/database/user.model";
import { TCreateUserParams } from "@/types";
import { connectToDatabase } from "../mongoose";

export async function createUser(params: TCreateUserParams) {
  try {
    await connectToDatabase();
    const newUser = await User.create(params);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function getUserInfo({
  userId,
}: {
  userId: string;
}): Promise<IUser | null | undefined> {
  try {
    connectToDatabase();
    const findUser = await User.findOne({ clerkId: userId });
    if (!findUser) return null;
    return findUser;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserRole(userId: string): Promise<string> {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return user.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "user"; // Default role if there's an error
  }
}

export async function deleteUserById(userId: string) {
  try {
    const clerkResponse = await fetch(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!clerkResponse.ok) {
      console.error(
        "❌ Error deleting user on Clerk:",
        await clerkResponse.text()
      );
      return { success: false, message: "Failed to delete user from Clerk" };
    }
    await connectToDatabase();
    await User.findOneAndDelete({ clerkId: userId });

    return { success: true, message: "Người dùng đã được xóa thành công" };
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return { success: false, message: "Error deleting user" };
  }
}

export async function getAllUsers(): Promise<IUser[] | undefined> {
  try {
    await connectToDatabase();
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await connectToDatabase();
    await User.findOneAndUpdate({ clerkId: userId }, { role });
    return { success: true, message: "Cập nhật vai trò người dùng thành công" };
  } catch (error) {
    console.error("Error updating user role:", error);
  }
}
