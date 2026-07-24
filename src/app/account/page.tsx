"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Loader";
import { formatPrice, formatDate } from "@/lib/utils";
import type { IOrder } from "@/types";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/orders?email=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (status === "unauthenticated" || !session) {
    router.push("/auth/login");
    return null;
  }

  const user = session.user;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="py-12 md:py-16 border-b border-light-gray/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-2">Account</p>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
              My Account
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
          <div className="p-6 mb-6 border border-light-gray/50">
            <div className="flex items-center gap-4 mb-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="w-14 h-14 object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-cool-ivory flex items-center justify-center">
                  <span className="text-lg font-playfair font-bold text-deep-navy">
                    {(user.name || user.email || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-base font-playfair font-semibold text-deep-navy">
                  {user.name || "Customer"}
                </h2>
                <p className="text-mid-gray text-xs">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-light-gray/50">
                <p className="text-[10px] text-mid-gray uppercase tracking-wider">Orders</p>
                <p className="text-xl font-bold text-deep-navy">{orders.length}</p>
              </div>
            </div>

            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          <div className="p-6 border border-light-gray/50">
            <h2 className="text-xs font-playfair font-semibold text-deep-navy mb-6 uppercase tracking-wider">
              Order History
            </h2>

            {ordersLoading ? (
              <PageLoader />
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-mid-gray text-xs mb-4">No orders yet</p>
                <Link href="/shop">
                  <Button variant="primary">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order._id}
                    href={`/order-confirmation/${order._id}?token=${order.accessToken}`}
                    className="block p-4 border border-light-gray/50 hover:border-deep-navy/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-deep-navy">{order.orderNumber}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-mid-gray">
                      <span>{formatDate(order.createdAt)}</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                    <p className="text-[10px] text-mid-gray mt-1">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      {order.paymentMethod === "COD" ? " · Cash on Delivery" : " · WhatsApp Order"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
