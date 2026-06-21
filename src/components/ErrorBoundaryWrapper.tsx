"use client";

import React from "react";
import ErrorBoundary from "./ErrorBoundary";

/**
 * Client-side wrapper for ErrorBoundary — needed because layout.tsx
 * is a Server Component and cannot directly use class-based error boundaries.
 */
export default function ErrorBoundaryWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallbackMessage="An unexpected error occurred in the application. Please refresh the page or try again.">
      {children}
    </ErrorBoundary>
  );
}
