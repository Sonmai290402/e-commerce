import { Schema, model, models } from "mongoose";

export interface IProduct {
  _id: string;
  title: string;
  image: string;
  price: number;
  brand: string;
  sale_price: number;
  slug: string;
  desc: string;
  created_at: Date;
  rating: number[];
  views: number;
  category: Schema.Types.ObjectId;
  subCategory: Schema.Types.ObjectId;
}
const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  brand: {
    type: String,
  },
  sale_price: {
    type: Number,
  },
  slug: {
    type: String,
    // required: true,
  },
  desc: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: [Number],
    default: [5],
  },
  views: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
});
const Product = models.Product || model<IProduct>("Product", productSchema);
export default Product;
