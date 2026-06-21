"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Leaf, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, User as UserIcon, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const { loginWithEmail, signUpWithEmail, loginWithGoogle, isAuthenticated, isAuthLoading } = useApp();
  const [formState, setFormState] = useState<"login" | "signup" | "forgot">("login");

  // Fields state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Form validation
  const validateForm = (): boolean => {
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (formState !== "forgot") {
      if (!password) {
        setErrorMessage("Please enter your password.");
        return false;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return false;
      }
    }

    if (formState === "signup" && !name.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      if (formState === "login") {
        const result = await loginWithEmail(email, password);
        if (result.success) {
          router.push("/dashboard");
        } else {
          setErrorMessage(result.error || "Login failed. Please try again.");
        }
      } else if (formState === "signup") {
        const result = await signUpWithEmail(name, email, password);
        if (result.success) {
          router.push("/onboarding");
        } else {
          setErrorMessage(result.error || "Sign up failed. Please try again.");
        }
      } else {
        // Forgot password placeholder
        setErrorMessage("");
        alert("Password reset instructions sent to: " + email);
        setFormState("login");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        router.push("/dashboard");
      } else if (result.error && result.error !== "Sign-in popup was closed. Please try again.") {
        setErrorMessage(result.error);
      }
    } catch {
      setErrorMessage("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (isAuthLoading) {
    return (
      <div role="status" aria-label="Checking authentication" className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-emerald-400" size={32} />
          <p className="text-sm text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-between py-12 px-6 relative overflow-hidden font-sans">

      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <header role="banner" className="max-w-lg w-full mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2" aria-label="CarbonCoach AI Home">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Leaf size={24} />
          </div>
          <span className="font-black text-xl text-white">CarbonCoach AI</span>
        </Link>
      </header>

      {/* Main card */}
      <main id="main-content" className="max-w-lg w-full mx-auto bg-slate-900/60 glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative z-10 my-8">

        {/* Toggle tabs */}
        {formState !== "forgot" && (
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-sm sm:text-base font-semibold mb-8" role="tablist" aria-label="Authentication method">
            <button
              role="tab"
              aria-selected={formState === "login"}
              onClick={() => { setFormState("login"); setErrorMessage(""); }}
              className={`flex-1 py-3 rounded-lg transition-colors cursor-pointer text-center ${
                formState === "login"
                  ? "bg-slate-800 text-white font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Sign In
            </button>
            <button
              role="tab"
              aria-selected={formState === "signup"}
              onClick={() => { setFormState("signup"); setErrorMessage(""); }}
              className={`flex-1 py-3 rounded-lg transition-colors cursor-pointer text-center ${
                formState === "signup"
                  ? "bg-slate-800 text-white font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Header titles */}
          <div>
            <h1 className="text-2xl font-black text-white">
              {formState === "login"
                ? "Welcome Back"
                : formState === "signup"
                ? "Join CarbonCoach AI"
                : "Reset Password"}
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {formState === "login"
                ? "Enter your credentials to access your dashboard."
                : formState === "signup"
                ? "Track emissions and plant trees with community leagues."
                : "Submit your email to receive a password reset link."}
            </p>
          </div>

          {/* Error display */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 pt-2">
            {/* Name field for Signup */}
            {formState === "signup" && (
              <div className="space-y-1.5">
                <label htmlFor="full-name" className="text-sm text-slate-400 font-semibold block">Full Name</label>
                <div className="relative">
                  <input
                    id="full-name"
                    type="text"
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-5 py-4 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    required
                    aria-required="true"
                  />
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm text-slate-400 font-semibold block">Email Address</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-5 py-4 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  required
                  aria-required="true"
                  aria-describedby={errorMessage ? "auth-error" : undefined}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
              </div>
            </div>

            {/* Password field (only for login/signup) */}
            {formState !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm text-slate-400 font-semibold">Password</label>
                  {formState === "login" && (
                    <button
                      type="button"
                      onClick={() => setFormState("forgot")}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={formState === "signup" ? "new-password" : "current-password"}
                    minLength={6}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    required
                    aria-required="true"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formState === "signup" && (
                  <p className="text-[10px] text-slate-500">Minimum 6 characters required</p>
                )}
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 py-4 rounded-xl text-sm sm:text-base font-black cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Authenticating...
              </>
            ) : formState === "login" ? (
              <>Sign In <ArrowRight size={20} /></>
            ) : formState === "signup" ? (
              <>Create Account <ArrowRight size={20} /></>
            ) : (
              <>Send Reset Link <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        {/* Separator */}
        {formState !== "forgot" && (
          <div className="relative my-8 text-center" role="separator">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-slate-900 px-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
              Or Connect With
            </span>
          </div>
        )}

        {/* Google Sign-In */}
        {formState !== "forgot" && (
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            aria-label="Continue with Google"
            className="w-full glass-panel border border-slate-800 hover:border-slate-700 text-slate-300 py-4 rounded-xl text-sm sm:text-base font-semibold cursor-pointer hover:bg-slate-800/40 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <GoogleIcon className="w-5 h-5" />
            )}
            Continue with Google
          </button>
        )}

        {/* Back to login trigger for Forgot page */}
        {formState === "forgot" && (
          <button
            onClick={() => { setFormState("login"); setErrorMessage(""); }}
            className="w-full text-center text-sm text-slate-400 hover:text-white font-semibold transition-colors mt-8 block"
          >
            ← Back to Sign In
          </button>
        )}

      </main>

      {/* Footer */}
      <footer role="contentinfo" className="max-w-lg w-full mx-auto text-center text-xs text-slate-600 z-10 flex items-center justify-center gap-1.5 mt-8">
        <ShieldCheck size={16} className="text-slate-500" /> Secured by Firebase Authentication — SSL encrypted
      </footer>

    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}
