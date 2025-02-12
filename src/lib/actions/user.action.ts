"use server";

import User from "@/database/user.modal";
import { TCreateUserParams } from "@/types";
import { connect } from "../mongoose";

export default async function createUser(params: TCreateUserParams) {
  try {
    await connect();
    const newUser = await User.create(params);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
