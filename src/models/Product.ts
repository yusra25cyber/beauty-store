import mongoose, { Schema, Document, Model } from "mongoose";

export interface IImageMeta {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  alt?: string;
}

export interface IProductVariant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  images: IImageMeta[];
}

export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  tags: string[];
  variants: IProductVariant[];
  brand: string;
  ingredients: string;
  howToUse: string;
  bestseller: boolean;
  newArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ImageMetaSchema = new Schema<IImageMeta>(
  {
    url: { type: String, required: true, maxlength: 2000 },
    publicId: { type: String, required: true, maxlength: 500 },
    format: { type: String, required: true, maxlength: 10 },
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 },
    alt: { type: String, maxlength: 500 },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true, maxlength: 200, trim: true },
    sku: { type: String, required: true, maxlength: 200, trim: true },
    price: { type: Number, required: true, min: 0.01, max: 999999 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: {
      type: [ImageMetaSchema],
      default: [],
      validate: [(arr: unknown[]) => arr.length <= 20, "Maximum 20 images per variant"],
    },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, maxlength: 200, trim: true },
    description: { type: String, required: true, maxlength: 5000, trim: true },
    price: { type: Number, required: true, min: 0.01, max: 999999 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: {
      type: [String],
      default: [],
      validate: [(arr: string[]) => arr.length <= 20, "Maximum 20 images"],
    },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    tags: {
      type: [String],
      default: [],
      validate: [(arr: string[]) => arr.length <= 50, "Maximum 50 tags"],
    },
    variants: {
      type: [ProductVariantSchema],
      default: [],
      validate: [(arr: unknown[]) => arr.length <= 100, "Maximum 100 variants"],
    },
    brand: { type: String, default: "", maxlength: 200, trim: true },
    ingredients: { type: String, default: "", maxlength: 5000, trim: true },
    howToUse: { type: String, default: "", maxlength: 5000, trim: true },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ bestseller: 1 });
ProductSchema.index({ newArrival: 1 });
ProductSchema.index({ "variants.sku": 1 });
ProductSchema.index({ "variants.price": 1 });

const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);

export default Product;
