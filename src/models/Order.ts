import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItemSchema {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICustomerSchema {
  name: string;
  phone: string;
  email?: string;
  address: string;
  deliveryNotes?: string;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  customer: ICustomerSchema;
  items: IOrderItemSchema[];
  totalAmount: number;
  paymentMethod: "COD" | "whatsapp";
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  accessToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemSchema>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true, maxlength: 200, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 100 },
    image: { type: String, default: "", maxlength: 1000 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true, maxlength: 200, trim: true },
      phone: { type: String, required: true, maxlength: 30, trim: true },
      email: { type: String, maxlength: 200, trim: true },
      address: { type: String, required: true, maxlength: 1000, trim: true },
      deliveryNotes: { type: String, maxlength: 2000, trim: true },
    },
    items: { type: [OrderItemSchema], required: true, validate: [(arr: unknown[]) => arr.length > 0, "At least one item is required"] },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["COD", "whatsapp"], required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    accessToken: { type: String, index: true },
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

OrderSchema.pre("save", async function () {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(5, "0")}`;
  }
});

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export default Order;
