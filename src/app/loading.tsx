import React from "react";

/**
 * Global loading state — renders during page transitions and lazy-loaded content.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className="min-h-screen flex items-center justify-center bg-dark-bg"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-slate-200">Loading...</p>
          <p className="text-xs text-slate-500">
            Calculating your carbon data
          </p>
        </div>
      </div>
    </div>
  );
}
