import { Schema, model, models } from "mongoose";

export interface ICategory {
  _id: string;
  title: string;
  image: string;
  subCategory: Schema.Types.ObjectId[];
}
const categorySchema = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  subCategory: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
});
const Category =
  models.Category || model<ICategory>("Category", categorySchema);
export default Category;
