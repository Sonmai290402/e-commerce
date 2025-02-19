"use server";

import User, { IUser } from "@/database/user.modal";
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
