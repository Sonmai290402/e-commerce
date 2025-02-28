import { Schema, model, models } from "mongoose";

export interface IProduct {
  _id: string;
  title: string;
  image: string;
  price: number;
  sale_price: number;
  slug: string;
  created_at: Date;
  capacity: string;
  chip: string;
  size: string;
  screen: string;
  rating: number[];
  views: number;
  isFeatured: boolean;
  category: Schema.Types.ObjectId;
  subCategory: Schema.Types.ObjectId;
  categorySlug: string;
  subCategorySlug: string;
  ram: string;
  card: string;
}
const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sale_price: {
    type: Number,
  },
  slug: {
    type: String,
    required: true,
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
  capacity: {
    type: String,
    // required: true,
  },
  chip: {
    type: String,
  },
  size: {
    type: String,
  },
  screen: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
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
  categorySlug: {
    type: String,
    required: true,
  },
  subCategorySlug: {
    type: String,
    required: true,
  },
  ram: {
    type: String,
  },
  card: {
    type: String,
  },
});
const Product = models.Product || model<IProduct>("Product", productSchema);
export default Product;
