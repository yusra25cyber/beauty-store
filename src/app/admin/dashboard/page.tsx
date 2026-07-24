"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageLoader } from "@/components/ui/Loader";
import { StatusBadge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { IOrder, AdminStats } from "@/types";
import {
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineCube,
  HiOutlineExclamationCircle,
  HiOutlinePlus,
  HiOutlineEye,
} from "react-icons/hi";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [lowStock, setLowStock] = useState<{ _id: string; name: string; stockQuantity: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        const orders: IOrder[] = ordersData.orders || [];
        const products = productsData.products || [];

        const deliveredOrders = orders.filter((o) => o.status === "delivered");
        const totalRevenue = deliveredOrders.reduce(
          (sum, o) => sum + o.totalAmount,
          0
        );

        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o) => o.status === "pending").length,
          totalRevenue,
          totalProducts: products.length,
        });

        setRecentOrders(orders.slice(0, 10));
        setLowStock(
          products.filter(
            (p: { stockQuantity: number }) => p.stockQuantity < 5
          )
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: HiOutlineClipboardList,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: HiOutlineExclamationCircle,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      label: "Revenue (Delivered)",
      value: formatPrice(stats.totalRevenue),
      icon: HiOutlineCurrencyDollar,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: HiOutlineCube,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-playfair font-bold text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Overview of your store
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="text-xl" />
                </div>
              </div>
              <p className="text-2xl font-bold text-text-primary">{card.value}</p>
              <p className="text-sm text-text-secondary mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair font-semibold text-text-primary text-lg">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm text-primary hover:text-primary-dark"
              >
                View All
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-text-secondary text-sm py-8 text-center">
                No orders yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-text-secondary font-medium">Order</th>
                      <th className="text-left py-3 text-text-secondary font-medium">Customer</th>
                      <th className="text-left py-3 text-text-secondary font-medium">Amount</th>
                      <th className="text-left py-3 text-text-secondary font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-50">
                        <td className="py-3">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3 text-text-secondary">
                          {order.customer.name}
                        </td>
                        <td className="py-3 font-medium">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h2 className="font-playfair font-semibold text-text-primary text-lg mb-4">
              Low Stock Alert
            </h2>
            {lowStock.length === 0 ? (
              <p className="text-green-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All products are well stocked
              </p>
            ) : (
              <div className="space-y-3">
                {lowStock.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-text-primary truncate mr-2">
                      {product.name}
                    </span>
                    <span className="text-red-500 font-medium flex-shrink-0">
                      {product.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-playfair font-semibold text-text-primary text-lg mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-all"
              >
                <HiOutlinePlus className="text-lg" />
                Add New Product
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-text-secondary rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
              >
                <HiOutlineEye className="text-lg" />
                View Orders
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-text-secondary rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
              >
                <HiOutlineCube className="text-lg" />
                Manage Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
