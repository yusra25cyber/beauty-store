"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-text-secondary hover:text-primary transition-colors"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto min-h-screen">
        <div className="p-6 pt-16 md:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
