import React from "react";
import Link from "next/link";
import { Leaf, Home, ArrowLeft } from "lucide-react";

/**
 * Custom 404 Not Found page — provides helpful navigation back to the app.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-slate-100 p-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-panel rounded-2xl p-10 border border-slate-700/50 max-w-lg w-full text-center space-y-6 relative z-10">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full w-fit mx-auto">
          <Leaf size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-gradient-emerald-teal">
            404
          </h1>
          <h2 className="text-xl font-bold text-white">Page Not Found</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track to reducing your carbon
            footprint!
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Link
            href="/"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Home size={14} /> Go Home
          </Link>
          <Link
            href="/dashboard"
            className="glass-panel border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800/40 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
