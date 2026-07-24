import React from "react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-deep-navy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[10px] text-mid-gray uppercase tracking-[0.2em]">Loading...</p>
      </div>
    </div>
  );
}
