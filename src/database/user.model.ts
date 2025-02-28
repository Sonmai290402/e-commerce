import { TCartItem } from "@/types";
import { EUserRole, EUserStatus } from "@/types/enums";
import { Schema, model, models } from "mongoose";

export interface IUser {
  _id: string;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  status: EUserStatus;
  role: EUserRole;
  created_at: Date;
  cart: TCartItem[];
}
const userSchema = new Schema<IUser>({
  clerkId: {
    type: String,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: Object.values(EUserRole),
    default: EUserRole.USER,
  },
  status: {
    type: String,
    enum: Object.values(EUserStatus),
    default: EUserStatus.ACTIVE,
  },
  cart: {
    type: [
      {
        _id: { type: String },
        name: { type: String },
        price: { type: Number },
        sale_price: { type: Number },
        quantity: { type: Number, default: 1 },
        categorySlug: { type: String },
        subCategorySlug: { type: String },
        productSlug: { type: String },
      },
    ],
    default: [],
  },
});
const User = models.User || model<IUser>("User", userSchema);
export default User;
