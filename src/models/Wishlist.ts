import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
  variantId?: string;
  addedAt: Date;
}

export interface IWishlistDocument extends Document {
  email: string;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: String, default: "" },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    items: { type: [WishlistItemSchema], default: [] },
  },
  { timestamps: true }
);

const Wishlist: Model<IWishlistDocument> =
  mongoose.models.Wishlist || mongoose.model<IWishlistDocument>("Wishlist", WishlistSchema);

export default Wishlist;
