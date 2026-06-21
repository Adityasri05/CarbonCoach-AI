"use client";

import React, { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary — catches unhandled React errors and shows
 * a user-friendly fallback instead of a white screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-slate-100 p-8"
        >
          <div className="glass-panel rounded-2xl p-8 border border-rose-500/30 max-w-md w-full text-center space-y-4">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full w-fit mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-white">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {this.props.fallbackMessage ||
                "An unexpected error occurred. Please try again."}
            </p>
            {this.state.error && (
              <details className="text-left text-xs text-slate-500 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <summary className="cursor-pointer font-semibold text-slate-400 mb-1">
                  Error details
                </summary>
                <code className="break-all">{this.state.error.message}</code>
              </details>
            )}
            <button
              onClick={this.handleRetry}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
