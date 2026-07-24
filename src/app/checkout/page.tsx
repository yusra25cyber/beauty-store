"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useCart } from "@/context/CartContext";
import { formatPrice, buildCheckoutMessage, buildWhatsAppUrl } from "@/lib/utils";
import type { OrderFormData } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    deliveryNotes: "",
    paymentMethod: "COD",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(formData.phone))
      newErrors.phone = "Please enter a valid phone number";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.address.trim()) newErrors.address = "Delivery address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OrderFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (formData.paymentMethod === "whatsapp") {
      const message = buildCheckoutMessage(
        items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        totalPrice,
        formData.name,
        formData.phone,
        formData.address
      );
      const waUrl = buildWhatsAppUrl(message);
      window.open(waUrl, "_blank", "noopener,noreferrer");
      clearCart();
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            address: formData.address,
            deliveryNotes: formData.deliveryNotes || undefined,
          },
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            variantName: item.variantName,
            variantSku: item.variantSku,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          })),
          paymentMethod: "COD",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        return;
      }

      clearCart();
      const token = data.order.accessToken;
      router.push(`/order-confirmation/${data.order._id}?token=${token}`);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-playfair font-bold text-lg text-deep-navy mb-4">
              Your Cart is Empty
            </h2>
            <Button variant="primary" onClick={() => router.push("/shop")}>
              Shop Now
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="py-12 md:py-16 border-b border-light-gray/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-2">Checkout</p>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
              Checkout
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="p-6">
                  <h2 className="text-sm font-playfair font-semibold text-deep-navy mb-6 uppercase tracking-wider">
                    Delivery Details
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      error={errors.name}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      error={errors.phone}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email (optional)"
                      error={errors.email}
                    />
                    <TextArea
                      label="Delivery Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full delivery address"
                      required
                      error={errors.address}
                    />
                    <TextArea
                      label="Delivery Notes"
                      name="deliveryNotes"
                      value={formData.deliveryNotes}
                      onChange={handleChange}
                      placeholder="Any special instructions? (optional)"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-sm font-playfair font-semibold text-deep-navy mb-6 uppercase tracking-wider">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-light-gray cursor-pointer hover:border-deep-navy transition-colors has-[:checked]:border-deep-navy has-[:checked]:bg-cool-ivory">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={handleChange}
                        className="text-deep-navy"
                      />
                      <div>
                        <p className="text-xs font-medium text-deep-navy">Cash on Delivery</p>
                        <p className="text-[10px] text-mid-gray">Pay when you receive your order</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-light-gray cursor-pointer hover:border-deep-navy transition-colors has-[:checked]:border-deep-navy has-[:checked]:bg-cool-ivory">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={formData.paymentMethod === "whatsapp"}
                        onChange={handleChange}
                        className="text-deep-navy"
                      />
                      <div>
                        <p className="text-xs font-medium text-deep-navy">WhatsApp Order</p>
                        <p className="text-[10px] text-mid-gray">Place order via WhatsApp message</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="border border-light-gray/50 p-6 sticky top-24">
                  <h3 className="text-sm font-playfair font-semibold text-deep-navy mb-4 uppercase tracking-wider">
                    Order Summary
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                        <div className="w-12 h-12 overflow-hidden bg-cool-ivory flex-shrink-0">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-deep-navy truncate">{item.name}</p>
                          <p className="text-[10px] text-mid-gray">
                            Qty: {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-deep-navy">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-light-gray/50 pt-3 space-y-1 text-xs">
                    <div className="flex justify-between text-mid-gray">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-mid-gray">
                      <span>Delivery</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-light-gray/50 pt-2 flex justify-between font-medium text-deep-navy text-sm">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={submitting}
                    className="mt-6"
                  >
                    {formData.paymentMethod === "COD" ? "Place Order" : "Open WhatsApp"}
                  </Button>

                  <p className="text-[10px] text-mid-gray text-center mt-3">
                    By placing this order, you agree to our delivery terms.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
