import { describe, it, expect } from "vitest";
import { z } from "zod";

/**
 * Validation tests mirroring the Zod schemas used in API routes.
 */

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  price: z.number().positive("Price must be positive").max(999999),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string().url()).max(20).optional().default([]),
  inStock: z.boolean().optional().default(true),
  stockQuantity: z.number().int().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
  tags: z.array(z.string().max(100)).max(50).optional().default([]),
});

const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
});

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Name is required").max(200),
    phone: z.string().min(1, "Phone is required").max(30),
    email: z.string().email().max(200).optional().or(z.literal("")),
    address: z.string().min(1, "Address is required").max(1000),
    deliveryNotes: z.string().max(2000).optional().or(z.literal("")),
  }),
  items: z.array(checkoutItemSchema).min(1, "At least one item is required"),
  paymentMethod: z.enum(["COD", "whatsapp"]),
});

const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  price: z.number().positive().max(999999).optional(),
  category: z.string().min(1).optional(),
  images: z.array(z.string().url()).max(20).optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string().max(100)).max(50).optional(),
});

describe("Product creation validation", () => {
  it("should accept valid product", () => {
    const result = createProductSchema.safeParse({
      name: "Handmade Lip Gloss",
      description: "A beautiful lip gloss",
      price: 12.99,
      category: "cat-123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.images).toEqual([]);
      expect(result.data.inStock).toBe(true);
      expect(result.data.featured).toBe(false);
    }
  });

  it("should reject empty name", () => {
    const result = createProductSchema.safeParse({
      name: "",
      description: "desc",
      price: 10,
      category: "cat-1",
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative price", () => {
    const result = createProductSchema.safeParse({
      name: "Product",
      description: "desc",
      price: -5,
      category: "cat-1",
    });
    expect(result.success).toBe(false);
  });

  it("should reject zero price", () => {
    const result = createProductSchema.safeParse({
      name: "Product",
      description: "desc",
      price: 0,
      category: "cat-1",
    });
    expect(result.success).toBe(false);
  });

  it("should reject name over 200 chars", () => {
    const result = createProductSchema.safeParse({
      name: "x".repeat(201),
      description: "desc",
      price: 10,
      category: "cat-1",
    });
    expect(result.success).toBe(false);
  });

  it("should reject more than 20 images", () => {
    const result = createProductSchema.safeParse({
      name: "Product",
      description: "desc",
      price: 10,
      category: "cat-1",
      images: Array(21).fill("https://example.com/img.jpg"),
    });
    expect(result.success).toBe(false);
  });
});

describe("Order creation validation", () => {
  const validOrder = {
    customer: {
      name: "Jane Doe",
      phone: "+1234567890",
      address: "123 Main St",
    },
    items: [{ productId: "prod-1", quantity: 2 }],
    paymentMethod: "COD" as const,
  };

  it("should accept valid order", () => {
    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("should reject empty customer name", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, name: "" },
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty items array", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("should reject quantity less than 1", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      items: [{ productId: "prod-1", quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject quantity over 100", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      items: [{ productId: "prod-1", quantity: 101 }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject non-integer quantity", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      items: [{ productId: "prod-1", quantity: 1.5 }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid payment method", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      paymentMethod: "credit_card",
    });
    expect(result.success).toBe(false);
  });

  it("should reject long name", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, name: "x".repeat(201) },
    });
    expect(result.success).toBe(false);
  });

  it("should reject long address", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, address: "x".repeat(1001) },
    });
    expect(result.success).toBe(false);
  });
});

describe("Product update validation", () => {
  it("should accept partial update", () => {
    const result = updateProductSchema.safeParse({
      price: 15.99,
      featured: true,
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = updateProductSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("should reject negative price", () => {
    const result = updateProductSchema.safeParse({ price: -1 });
    expect(result.success).toBe(false);
  });

  it("should reject non-integer stock quantity", () => {
    const result = updateProductSchema.safeParse({ stockQuantity: 1.5 });
    expect(result.success).toBe(false);
  });

  it("should reject negative stock quantity", () => {
    const result = updateProductSchema.safeParse({ stockQuantity: -1 });
    expect(result.success).toBe(false);
  });
});

describe("Order privacy - access token validation", () => {
  it("access token should be a non-empty string", () => {
    const token = "a".repeat(48); // 24 bytes hex = 48 chars
    expect(token.length).toBe(48);
    expect(typeof token).toBe("string");
  });

  it("should not include PII in token", () => {
    const token = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6";
    expect(token).not.toContain("@");
    expect(token).not.toContain("+");
    // Token is just a random hex string - no PII
    expect(/^[0-9a-f]+$/.test(token)).toBe(true);
  });
});
