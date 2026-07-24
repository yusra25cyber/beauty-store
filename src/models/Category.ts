import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  image: string;
  description: string;
}

const CategorySchema = new Schema<ICategoryDocument>({
  name: { type: String, required: true, maxlength: 200, trim: true },
  slug: { type: String, required: true, unique: true, maxlength: 200, trim: true },
  image: { type: String, default: "", maxlength: 1000 },
  description: { type: String, default: "", maxlength: 2000 },
});

CategorySchema.index({ slug: 1 });

const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>("Category", CategorySchema);

export default Category;
