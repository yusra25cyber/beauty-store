"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Loader";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatDate, buildWhatsAppUrl } from "@/lib/utils";
import type { IOrder } from "@/types";
import { Suspense } from "react";

function OrderContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { clearCart, items } = useCart();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = searchParams.get("token");
        let url = `/api/orders/${params.id}`;
        if (token) {
          url += `?token=${encodeURIComponent(token)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, searchParams]);

  const itemsLength = items.length;
  useEffect(() => {
    if (order && itemsLength > 0) {
      clearCart();
    }
  }, [order, itemsLength, clearCart]);

  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-playfair font-bold text-lg text-deep-navy mb-4">
              Order Not Found
            </h2>
            <p className="text-mid-gray text-xs mb-6">
              We couldn&apos;t find an order with that information.
            </p>
            <Link href="/shop" className="inline-flex px-5 py-2.5 bg-deep-navy text-white text-xs uppercase tracking-wider font-medium hover:bg-black transition-all">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const whatsappMessage = `Hi! I'd like to confirm my order: ${order.orderNumber}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="py-12 md:py-16 bg-cool-ivory">
          <div className="max-w-2xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
            <div className="w-14 h-14 bg-deep-navy flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-deep-navy mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-mid-gray text-sm mb-1">
              Thank you for your order{order.customer ? `, ${order.customer.name}` : ""}!
            </p>
            <p className="text-mid-gray text-xs">
              Order: <span className="font-semibold text-deep-navy">{order.orderNumber}</span>
            </p>
            {order.paymentMethod === "COD" && (
              <p className="text-xs text-mid-gray mt-4">
                We will contact you to confirm your order and arrange delivery.
              </p>
            )}
            {order.paymentMethod === "whatsapp" && (
              <div className="mt-4">
                <p className="text-xs text-mid-gray mb-3">
                  Please complete your order via WhatsApp
                </p>
                <a
                  href={buildWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-deep-navy text-white text-xs uppercase tracking-wider font-medium hover:bg-black transition-all"
                >
                  Chat on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
          {order.customer && (
            <div className="p-6 mb-6 border border-light-gray/50">
              <h2 className="text-xs font-playfair font-semibold text-deep-navy mb-4 uppercase tracking-wider">
                Order Details
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-mid-gray">Order Number</span>
                  <span className="font-medium text-deep-navy">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mid-gray">Date</span>
                  <span className="font-medium text-deep-navy">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mid-gray">Status</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-mid-gray">Payment</span>
                  <span className="font-medium text-deep-navy">
                    {order.paymentMethod === "COD" ? "Cash on Delivery" : "WhatsApp Order"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {order.customer && (
            <div className="p-6 mb-6 border border-light-gray/50">
              <h2 className="text-xs font-playfair font-semibold text-deep-navy mb-4 uppercase tracking-wider">
                Delivery Details
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-mid-gray">Name</span>
                  <span className="font-medium text-deep-navy">{order.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mid-gray">Phone</span>
                  <span className="font-medium text-deep-navy">{order.customer.phone}</span>
                </div>
                {order.customer.email && (
                  <div className="flex justify-between">
                    <span className="text-mid-gray">Email</span>
                    <span className="font-medium text-deep-navy">{order.customer.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-mid-gray">Address</span>
                  <span className="font-medium text-deep-navy text-right max-w-[60%]">{order.customer.address}</span>
                </div>
                {order.customer.deliveryNotes && (
                  <div className="flex justify-between">
                    <span className="text-mid-gray">Notes</span>
                    <span className="font-medium text-deep-navy text-right max-w-[60%]">{order.customer.deliveryNotes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-6 mb-8 border border-light-gray/50">
            <h2 className="text-xs font-playfair font-semibold text-deep-navy mb-4 uppercase tracking-wider">
              Items Ordered
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3 pb-3 border-b border-light-gray/50 last:border-b-0 last:pb-0">
                    <div className="w-14 h-14 overflow-hidden bg-cool-ivory flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-deep-navy">{item.name}</p>
                      {item.variantName && (
                        <p className="text-[10px] text-mid-gray">{item.variantName}</p>
                      )}
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
            <div className="mt-4 pt-4 border-t border-light-gray/50 flex justify-between">
              <span className="text-xs font-semibold text-deep-navy">Total</span>
              <span className="text-sm font-bold text-deep-navy">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link href="/shop" className="inline-flex px-5 py-2.5 bg-deep-navy text-white text-xs uppercase tracking-wider font-medium hover:bg-black transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OrderContent />
    </Suspense>
  );
}
