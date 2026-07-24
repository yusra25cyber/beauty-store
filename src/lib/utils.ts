export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(price);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestamp}${random}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";
}

export function buildWhatsAppUrl(message: string): string {
  const number = getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function buildSingleProductMessage(
  productName: string,
  qty: number,
  price: number
): string {
  return `Hi! I'd like to order:\nProduct: ${productName}\nQuantity: ${qty}\nPrice: RM${price}\nPlease confirm availability.`;
}

export function buildCheckoutMessage(
  items: { name: string; quantity: number; price: number }[],
  total: number,
  customerName: string,
  phone: string,
  address: string
): string {
  const itemLines = items
    .map((item) => `- ${item.name} x${item.quantity} = RM${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  return `Hi! I'd like to place an order:\n${itemLines}\nTotal: RM${total.toFixed(2)}\nName: ${customerName}\nPhone: ${phone}\nAddress: ${address}\nPayment: WhatsApp/COD`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
