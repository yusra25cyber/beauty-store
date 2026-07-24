import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReviewDocument extends Document {
  product: mongoose.Types.ObjectId;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, createdAt: -1 });

const Review: Model<IReviewDocument> =
  mongoose.models.Review || mongoose.model<IReviewDocument>("Review", ReviewSchema);

export default Review;
