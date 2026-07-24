"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Loader";
import { formatPrice, formatDate } from "@/lib/utils";
import type { IOrder } from "@/types";
import { HiOutlineEye } from "react-icons/hi";

const statusFilters = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetch(`/api/orders?${params.toString()}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  if (loading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-playfair font-bold text-text-primary">
          Orders
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === filter.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Order</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Items</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Payment</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Date</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-primary">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-text-primary">{order.customer.name}</p>
                        <p className="text-text-secondary text-xs">{order.customer.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {order.paymentMethod === "COD" ? "Cash on Delivery" : "WhatsApp"}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        <HiOutlineEye className="text-lg" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
