import mongoose, { Schema, Document } from "mongoose";

export interface INewsletterDocument extends Document {
  email: string;
  subscribedAt: Date;
}

const NewsletterSchema = new Schema<INewsletterDocument>({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 500 },
  subscribedAt: { type: Date, default: Date.now },
});

const Newsletter =
  mongoose.models.Newsletter || mongoose.model<INewsletterDocument>("Newsletter", NewsletterSchema);

export default Newsletter;
