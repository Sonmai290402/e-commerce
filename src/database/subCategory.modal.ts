import { Schema, model, models } from "mongoose";

export interface ISubCategory {
  _id: string;
  title: string;
  image: string;
  product: Schema.Types.ObjectId[];
}
const subCategorySchema = new Schema<ISubCategory>({
  title: {
    type: String,
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
