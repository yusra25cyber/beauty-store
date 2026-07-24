export interface IImageMeta {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  alt?: string;
}

export interface IProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  images: IImageMeta[];
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ICategory | string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  tags: string[];
  variants: IProductVariant[];
  brand: string;
  bestseller: boolean;
  newArrival: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface IOrderItem {
  productId: string;
  variantId?: string;
  variantName?: string;
  variantSku?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  deliveryNotes?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: ICustomer;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: "COD" | "whatsapp";
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  accessToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdmin {
  _id: string;
  email: string;
  password: string;
  name: string;
}

export interface IUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  variantName: string;
  variantSku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stockQuantity: number;
}

export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  deliveryNotes: string;
  paymentMethod: "COD" | "whatsapp";
}

export interface SortOption {
  label: string;
  value: string;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

export interface IReview {
  _id: string;
  product: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderConfirmation {
  order: IOrder;
  accessToken: string;
}
