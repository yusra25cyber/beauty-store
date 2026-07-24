"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineLogout,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { classNames } from "@/lib/utils";

interface AdminSidebarProps {
  onNavigate?: () => void;
}

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HiOutlineHome },
  { href: "/admin/products", label: "Products", icon: HiOutlineShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: HiOutlineClipboardList },
  { href: "/admin/categories", label: "Categories", icon: HiOutlineCollection },
];

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
      } else {
        toast.error("Failed to logout");
      }
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/admin/dashboard" className="text-xl font-playfair font-bold text-primary">
          Glow & Grace
        </Link>
        <p className="text-xs text-text-secondary mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={classNames(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
              )}
            >
              <Icon className="text-lg" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 transition-all mb-2"
        >
          <HiOutlineShoppingBag className="text-lg" />
          View Store
        </Link>
        <button
          onClick={() => { handleLogout(); if (onNavigate) onNavigate(); }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full"
        >
          <HiOutlineLogout className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
}
