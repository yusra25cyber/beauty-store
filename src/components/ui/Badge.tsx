import React from "react";
import { classNames } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-light-gray text-mid-gray",
    primary: "bg-deep-navy/5 text-deep-navy",
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={classNames(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
    pending: { variant: "warning", label: "Pending" },
    confirmed: { variant: "info", label: "Confirmed" },
    preparing: { variant: "primary", label: "Preparing" },
    out_for_delivery: { variant: "primary", label: "Out for Delivery" },
    delivered: { variant: "success", label: "Delivered" },
    cancelled: { variant: "danger", label: "Cancelled" },
  };

  const config = statusConfig[status] || { variant: "default" as const, label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
