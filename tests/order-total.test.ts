import { describe, it, expect } from "vitest";

/**
 * Server-side order total calculation tests.
 * These validate the logic that should be used in the API route.
 */

interface ServerOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function calculateOrderTotal(
  items: { price: number; quantity: number }[]
): number {
  return Math.round(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
  ) / 100;
}

function buildServerOrderItem(
  product: { _id: string; name: string; price: number; images: string[] },
  quantity: number
): ServerOrderItem {
  return {
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity,
    image: product.images && product.images.length > 0 ? product.images[0] : "",
  };
}

describe("Server-side order total calculation", () => {
  it("should calculate total from server prices, not client prices", () => {
    // Client might send $5 but server price is $10
    const serverProduct = {
      _id: "prod-1",
      name: "Lip Gloss",
      price: 10.00,
      images: [],
    };

    const clientAttempt = { price: 5.00, quantity: 2 };
    const orderItem = buildServerOrderItem(serverProduct, clientAttempt.quantity);

    expect(orderItem.price).toBe(10.00);
    expect(orderItem.price * orderItem.quantity).toBe(20.00);
    expect(clientAttempt.price * clientAttempt.quantity).toBe(10.00);
  });

  it("should calculate correct total for multiple items", () => {
    const items = [
      { price: 15.99, quantity: 2 },
      { price: 25.50, quantity: 1 },
      { price: 5.00, quantity: 3 },
    ];

    const total = calculateOrderTotal(items);
    expect(total).toBe(72.48);
  });

  it("should round to 2 decimal places", () => {
    const items = [
      { price: 10.005, quantity: 1 },
    ];

    const total = calculateOrderTotal(items);
    expect(total).toBe(10.01);
  });

  it("should return 0 for empty cart", () => {
    expect(calculateOrderTotal([])).toBe(0);
  });

  it("should handle single item", () => {
    const items = [{ price: 49.99, quantity: 1 }];
    expect(calculateOrderTotal(items)).toBe(49.99);
  });
});

describe("Order item snapshot (server-saved data)", () => {
  it("should use server product name, not client-provided name", () => {
    const serverProduct = {
      _id: "prod-1",
      name: "Handmade Lip Gloss - Rose",
      price: 12.99,
      images: ["https://example.com/img.jpg"],
    };

    // Client might send "Lip Gloss" but server saves its own name
    const clientProvidedName = "Lip Gloss";
    const serverItem = buildServerOrderItem(serverProduct, 2);

    expect(serverItem.name).toBe(serverProduct.name);
    expect(serverItem.name).not.toBe(clientProvidedName);
  });

  it("should select first image as order item image", () => {
    const product = {
      _id: "prod-1",
      name: "Test",
      price: 10,
      images: ["first.jpg", "second.jpg", "third.jpg"],
    };

    const item = buildServerOrderItem(product, 1);
    expect(item.image).toBe("first.jpg");
  });

  it("should use empty string if no images", () => {
    const product = {
      _id: "prod-1",
      name: "Test",
      price: 10,
      images: [],
    };

    const item = buildServerOrderItem(product, 1);
    expect(item.image).toBe("");
  });
});
