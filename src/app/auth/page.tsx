"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Leaf, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const { addNotification, login, signUp } = useApp();
  const [formState, setFormState] = useState<"login" | "signup" | "forgot">("login");
  
  // Fields state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock loading sequence
    setTimeout(() => {
      setIsLoading(false);
      if (formState === "login") {
        login(name || email.split("@")[0], email);
        addNotification("success", "Login successful! Welcome back.");
        router.push("/dashboard");
      } else if (formState === "signup") {
        signUp(name, email);
        addNotification("success", "Sign up successful! Let's initialize your profile.");
        router.push("/onboarding");
      } else {
        alert("Password reset code sent to: " + email);
        setFormState("login");
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login("Google User", email || "google-user@example.com");
      addNotification("success", "Google authentication successful!");
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-between py-12 px-6 relative overflow-hidden font-sans">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-lg w-full mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Leaf size={24} />
          </div>
          <span className="font-black text-xl text-white">CarbonCoach AI</span>
        </Link>
      </header>

      {/* Main card */}
      <main className="max-w-lg w-full mx-auto bg-slate-900/60 glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative z-10 my-8">
        
        {/* Toggle tabs */}
        {formState !== "forgot" && (
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-sm sm:text-base font-semibold mb-8">
            <button
              onClick={() => setFormState("login")}
              className={`flex-1 py-3 rounded-lg transition-colors cursor-pointer text-center ${
                formState === "login"
                  ? "bg-slate-800 text-white font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setFormState("signup")}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Header titles */}
          <div>
            <h2 className="text-2xl font-black text-white">
              {formState === "login"
                ? "Welcome Back"
                : formState === "signup"
                ? "Join CarbonCoach AI"
                : "Reset Password"}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {formState === "login"
                ? "Enter your credentials to access your dashboard."
                : formState === "signup"
                ? "Track emissions and plant trees with community leagues."
                : "Submit your email to fetch a password reset code."}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Name field for Signup */}
            {formState === "signup" && (
              <div className="space-y-1.5">
                <label htmlFor="full-name" className="text-sm text-slate-400 font-semibold block">Full Name</label>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-5 py-4 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 py-4 rounded-xl text-sm sm:text-base font-black cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all mt-8 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : formState === "login" ? "Sign In" : formState === "signup" ? "Create Account" : "Submit Password Reset"}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        {/* Separator */}
        {formState !== "forgot" && (
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-slate-900 px-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
              Or Connect With
            </span>
          </div>
        )}

        {/* Google Mock login */}
        {formState !== "forgot" && (
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full glass-panel border border-slate-800 hover:border-slate-700 text-slate-300 py-4 rounded-xl text-sm sm:text-base font-semibold cursor-pointer hover:bg-slate-800/40 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            <GoogleIcon className="w-5 h-5" />
            Continue with Google
          </button>
        )}

        {/* Back to login trigger for Forgot page */}
        {formState === "forgot" && (
          <button
            onClick={() => setFormState("login")}
            className="w-full text-center text-sm text-slate-400 hover:text-white font-semibold transition-colors mt-8 block"
          >
            ← Back to Sign In
          </button>
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-lg w-full mx-auto text-center text-xs text-slate-600 z-10 flex items-center justify-center gap-1.5 mt-8">
        <ShieldCheck size={16} className="text-slate-500" /> Secure SSL connection verified
      </footer>

    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}
