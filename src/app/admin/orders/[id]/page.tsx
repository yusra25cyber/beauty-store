"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Loader";
import { formatPrice, formatDate } from "@/lib/utils";
import type { IOrder } from "@/types";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
        setSelectedStatus(data.order.status);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order?.status) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update status");
        return;
      }

      setOrder(data.order);
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100",
      confirmed: "bg-blue-100",
      preparing: "bg-primary/10",
      out_for_delivery: "bg-purple-100",
      delivered: "bg-green-100",
      cancelled: "bg-red-100",
    };
    return colors[status] || "bg-gray-100";
  };

  if (loading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <p className="text-text-secondary">Order not found</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>
        <h1 className="text-2xl font-playfair font-bold text-text-primary">
          Order {order.orderNumber}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-playfair font-semibold text-text-primary text-lg mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{item.name}</p>
                    <p className="text-sm text-text-secondary">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-lg">
              <span className="font-semibold text-text-primary">Total</span>
              <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-playfair font-semibold text-text-primary text-lg mb-4">
              Customer Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary block">Name</span>
                <span className="font-medium text-text-primary">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-text-secondary block">Phone</span>
                <span className="font-medium text-text-primary">{order.customer.phone}</span>
              </div>
              {order.customer.email && (
                <div>
                  <span className="text-text-secondary block">Email</span>
                  <span className="font-medium text-text-primary">{order.customer.email}</span>
                </div>
              )}
              <div>
                <span className="text-text-secondary block">Payment</span>
                <span className="font-medium text-text-primary">
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : "WhatsApp"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-text-secondary block">Address</span>
                <span className="font-medium text-text-primary">{order.customer.address}</span>
              </div>
              {order.customer.deliveryNotes && (
                <div className="sm:col-span-2">
                  <span className="text-text-secondary block">Delivery Notes</span>
                  <span className="font-medium text-text-primary">{order.customer.deliveryNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-playfair font-semibold text-text-primary text-lg mb-4">
              Update Status
            </h2>
            <div className="space-y-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Update order status"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                fullWidth
                onClick={handleStatusUpdate}
                isLoading={updating}
                disabled={selectedStatus === order.status}
              >
                Update Status
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-playfair font-semibold text-text-primary text-lg mb-4">
              Order Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${getStatusColor(order.status)}`} />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Current Status: <StatusBadge status={order.status} />
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full mt-1.5 bg-green-100" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Order Placed</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
