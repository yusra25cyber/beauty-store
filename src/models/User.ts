import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  name?: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
    },
    name: { type: String, maxlength: 200, trim: true },
    password: { type: String, select: false },
    image: { type: String, maxlength: 1000 },
    emailVerified: { type: Date },
  },
  { timestamps: true, collection: "users" }
);

UserSchema.index({ email: 1 });

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
