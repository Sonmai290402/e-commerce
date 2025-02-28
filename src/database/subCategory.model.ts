import { Schema, model, models } from "mongoose";

export interface ISubCategory {
  _id: string;
  title: string;
  slug: string;
  categorySlug: string;
  image: string;
  categoryId: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId[];
}
const subCategorySchema = new Schema<ISubCategory>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  categorySlug: {
    type: String,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  product: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});
const SubCategory =
  models.SubCategory || model<ISubCategory>("SubCategory", subCategorySchema);
export default SubCategory;
