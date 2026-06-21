"use client";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Sparkles,
  Camera,
  Award,
  Users,
  Gift,
  User,
  LogOut,
  Leaf,
  Bell,
  X,
  Flame,
  CheckCircle2,
  Info,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy-load heavy tab components for performance optimization
const TabDashboard = lazy(() => import("@/components/TabDashboard"));
const TabCarbonTwin = lazy(() => import("@/components/TabCarbonTwin"));
const TabCamera = lazy(() => import("@/components/TabCamera"));
const TabChallenges = lazy(() => import("@/components/TabChallenges"));
const TabLeaderboard = lazy(() => import("@/components/TabLeaderboard"));
const TabRewards = lazy(() => import("@/components/TabRewards"));
const TabProfile = lazy(() => import("@/components/TabProfile"));

// Global Overlay component
import AIChatbot from "@/components/AIChatbot";

/** Loading fallback for lazy-loaded tab components */
function TabLoadingFallback() {
  return (
    <div role="status" aria-label="Loading tab content" className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="animate-spin text-emerald-400" size={28} />
      <p className="text-xs text-slate-500">Loading...</p>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isAuthLoading,
    greenPoints,
    activeTab,
    setActiveTab,
    notifications,
    clearNotification,
    logout,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Auth guard: redirect to login if not authenticated, or onboarding if not completed
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else if (user && !user.onboarded) {
        router.push("/onboarding");
      }
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  // Tab definitions
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "twin", label: "AI Carbon Twin", icon: Sparkles },
    { id: "camera", label: "Carbon Camera", icon: Camera },
    { id: "challenges", label: "Eco Challenges", icon: Award },
    { id: "leaderboard", label: "Leaderboard", icon: Users },
    { id: "rewards", label: "Green Rewards", icon: Gift },
    { id: "profile", label: "Profile & Badges", icon: User },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <TabDashboard />;
      case "twin":
        return <TabCarbonTwin />;
      case "camera":
        return <TabCamera />;
      case "challenges":
        return <TabChallenges />;
      case "leaderboard":
        return <TabLeaderboard />;
      case "rewards":
        return <TabRewards />;
      case "profile":
        return <TabProfile />;
      default:
        return <TabDashboard />;
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-dark-bg text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300" role="application" aria-label="CarbonCoach AI Dashboard">
      
      {/* Desktop Sidebar navigation */}
      <aside role="navigation" aria-label="Main navigation" className="hidden lg:flex flex-col w-[260px] bg-slate-950/95 border-r border-slate-800/60 shrink-0 px-4 py-6 justify-between backdrop-blur-sm">
        <div className="space-y-8">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 px-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl animate-pulse-glow">
              <Leaf size={18} />
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              CarbonCoach <span className="text-emerald-400">AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/15"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon size={18} className={isActive ? "stroke-[2.5]" : "stroke-[1.5]"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer signout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border border-transparent hover:border-rose-500/10"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-22 lg:pb-0">
        
        {/* Top Header */}
        <header className="h-14 sm:h-16 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Logo Brand */}
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Leaf size={16} />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">CarbonCoach AI</span>
          </div>

          <div className="hidden lg:block">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">WORKSPACE</p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Green Points Balance indicator */}
            <span className="glass-panel text-[11px] px-3 py-1.5 rounded-full border border-slate-700/50 text-amber-400 font-bold flex items-center gap-1.5">
              🏆 {greenPoints} Pts
            </span>

            {/* Notification alert bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all relative cursor-pointer"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </button>

              {/* Notification dropdown popover */}
              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-4 space-y-3 z-50"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-slate-200">Alerts & Achievements</span>
                      <button
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/60 flex items-start justify-between gap-2"
                          >
                            <div className="text-[11px] text-slate-300 leading-relaxed">
                              {n.message}
                            </div>
                            <button
                              onClick={() => clearNotification(n.id)}
                              className="text-slate-600 hover:text-slate-400 p-0.5 rounded shrink-0"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-slate-500 italic">
                          No notifications to display
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar link */}
            <div
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <Image
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border-2 border-slate-700/80 hover:border-emerald-500/50 transition-colors"
                alt="User avatar"
                unoptimized
              />
              <span className="text-xs font-bold text-slate-300 hidden sm:inline">{user.name.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        {/* Dynamic subview tab content */}
        <main id="main-content" role="main" aria-label="Dashboard content" className="flex-1 p-4 sm:p-5 lg:p-8 max-w-6xl w-full mx-auto relative">
          
          {/* Floating alerts display (Toast system) */}
          <div className="fixed top-16 sm:top-20 right-4 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-[90vw] sm:max-w-sm w-full">
            <AnimatePresence>
              {notifications.slice(0, 3).map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.9 }}
                  className="glass-panel border border-emerald-500/20 bg-slate-900/95 p-3.5 rounded-xl flex items-start gap-3 shadow-2xl pointer-events-auto"
                >
                  {notif.type === "success" || notif.type === "achievement" ? (
                    <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  ) : notif.type === "streak" ? (
                    <Flame className="text-orange-400 shrink-0 mt-0.5" size={16} />
                  ) : (
                    <Info className="text-sky-400 shrink-0 mt-0.5" size={16} />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-100 leading-snug">{notif.message}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">just now</p>
                  </div>
                  
                  <button
                    onClick={() => clearNotification(notif.id)}
                    className="text-slate-500 hover:text-slate-300 shrink-0 p-1"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Suspense fallback={<TabLoadingFallback />}>
            {renderActiveTabContent()}
          </Suspense>
        </main>
      </div>

      {/* Floating Chatbot Assistant */}
      <AIChatbot />

      {/* Mobile Bottom Navigation Bar - Enhanced with larger touch targets */}
      <nav role="navigation" aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/60 flex lg:hidden items-stretch justify-around px-1 safe-bottom" style={{ height: '72px' }}>
        {sidebarItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold py-2 px-2 cursor-pointer transition-all relative ${
                isActive ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-emerald-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.5]"} />
              <span className="truncate max-w-[52px]">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
        {/* More items dropdown trigger — shows remaining two */}
        <button
          onClick={() => setActiveTab("rewards")}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold py-2 px-2 cursor-pointer transition-all relative ${
            activeTab === "rewards" ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {activeTab === "rewards" && (
            <motion.div
              layoutId="bottomNavIndicator"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-emerald-400"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Gift size={20} className={activeTab === "rewards" ? "stroke-[2.5]" : "stroke-[1.5]"} />
          <span>Rewards</span>
        </button>
        {/* Profile on mobile as last element */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold py-2 px-2 cursor-pointer transition-all relative ${
            activeTab === "profile" ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {activeTab === "profile" && (
            <motion.div
              layoutId="bottomNavIndicator"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-emerald-400"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Image
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80"
            width={20}
            height={20}
            className={`w-5 h-5 rounded-full object-cover border-2 ${
              activeTab === "profile" ? "border-emerald-400" : "border-slate-700"
            }`}
            alt="Profile Avatar"
            unoptimized
          />
          <span>Profile</span>
        </button>
      </nav>

    </div>
  );
}
