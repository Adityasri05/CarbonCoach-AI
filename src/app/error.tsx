"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Custom error page — renders when an unhandled runtime error occurs.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-slate-100 p-8"
    >
      <div className="glass-panel rounded-2xl p-8 border border-rose-500/20 max-w-md w-full text-center space-y-5">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full w-fit mx-auto">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-black text-white">
          Oops! Something broke
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          An unexpected error occurred. Our team has been notified. Please try
          refreshing or return to the homepage.
        </p>
        {error?.message && (
          <p className="text-xs text-slate-500 bg-slate-900/50 p-2 rounded-lg border border-slate-800 break-all">
            {error.message}
          </p>
        )}
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} /> Retry
          </button>
          <Link
            href="/"
            className="glass-panel border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800/40 transition-all flex items-center gap-2"
          >
            <Home size={14} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
