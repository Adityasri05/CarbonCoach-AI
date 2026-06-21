"use client";

import React from "react";

/**
 * Skip Navigation Link — WCAG 2.1 AA accessibility requirement.
 * Allows keyboard & screen-reader users to skip directly to the main content.
 */
export default function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-emerald-500 focus:text-slate-950 focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold focus:text-sm focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
    >
      Skip to main content
    </a>
  );
}
