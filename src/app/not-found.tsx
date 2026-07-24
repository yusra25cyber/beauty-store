import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-playfair font-bold text-deep-navy mb-4">404</h1>
        <p className="text-mid-gray text-xs mb-6">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="inline-flex px-5 py-2.5 bg-deep-navy text-white text-xs uppercase tracking-wider font-medium hover:bg-black transition-all"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
