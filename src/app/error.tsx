"use client";

import React from "react";
import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-playfair font-bold text-deep-navy mb-4">500</h1>
        <p className="text-mid-gray text-xs mb-6">Something went wrong on our end. Please try again.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-deep-navy text-white text-xs uppercase tracking-wider font-medium hover:bg-black transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-deep-navy text-deep-navy text-xs uppercase tracking-wider font-medium hover:bg-deep-navy hover:text-white transition-all"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
