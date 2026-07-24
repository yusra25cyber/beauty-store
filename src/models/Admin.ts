import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminDocument extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
    },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

const Admin: Model<IAdminDocument> =
  mongoose.models.Admin || mongoose.model<IAdminDocument>("Admin", AdminSchema);

export default Admin;
