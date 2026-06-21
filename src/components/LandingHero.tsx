"use client";

import React from "react";
import { ArrowRight, Leaf, Zap, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface LandingHeroProps {
  onGetStarted: () => void;
  onCalculate: () => void;
}

export default function LandingHero({ onGetStarted, onCalculate }: LandingHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left text column */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start gap-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider"
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            AI-Powered Sustainability Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
          >
            Know Your Impact. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              Reduce It Every Day.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed"
          >
            Track your carbon footprint, receive AI-powered sustainability recommendations, and build eco-friendly habits that make a real-world impact.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4"
          >
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base group"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onCalculate}
              className="glass-panel text-slate-100 border border-slate-700 hover:border-slate-500 font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800/40 transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base"
            >
              Calculate My Footprint
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-6 mt-8 border-t border-slate-800/80 pt-6 w-full justify-center lg:justify-start"
          >
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-white">45K+</p>
              <p className="text-xs text-slate-500">Active Users</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-emerald-400">12.5M kg</p>
              <p className="text-xs text-slate-500">CO₂ Reduced</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-sky-400">4.8★</p>
              <p className="text-xs text-slate-500">User Rating</p>
            </div>
          </motion.div>
        </div>

        {/* Right illustration column */}
        <div className="lg:col-span-5 flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[420px] aspect-square relative"
          >
            {/* Hologram base */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-emerald-500/10 rounded-full blur-md" />
            
            {/* Animated outer tech rings */}
            <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/10 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-4 rounded-full border border-slate-700/30 pointer-events-none" />
            <div className="absolute inset-10 rounded-full border border-dashed border-teal-500/20 animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse" }} />

            {/* Earth Core Concept */}
            <div className="absolute inset-16 bg-slate-900 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border border-slate-800">
              <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400 animate-spin-slow" style={{ animationDuration: "120s" }}>
                {/* Oceans Background */}
                <circle cx="50" cy="50" r="48" fill="#1e293b" />
                {/* Continents (Simplified premium vector shapes) */}
                <path d="M20,40 Q25,25 35,30 T45,45 T30,55 Z" fill="#10b981" fillOpacity="0.8" />
                <path d="M50,25 Q60,15 70,20 T75,35 T60,50 Z" fill="#10b981" fillOpacity="0.8" />
                <path d="M55,60 Q70,55 80,65 T70,80 T50,75 Z" fill="#14b8a6" fillOpacity="0.8" />
                <path d="M25,65 Q35,70 30,85 T15,80 Z" fill="#10b981" fillOpacity="0.8" />
                {/* Grid lines */}
                <circle cx="50" cy="50" r="40" stroke="rgba(255, 255, 255, 0.05)" fill="none" strokeWidth="0.5" />
                <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
                <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
              </svg>
              
              {/* Central Glowing Shield */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-900/60 pointer-events-none" />
            </div>

            {/* Orbiting Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 right-4 lg:right-1/10 glass-panel border border-slate-700 rounded-2xl p-3 flex items-center gap-3 shadow-xl"
            >
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider">ECO TARGET</p>
                <p className="text-xs font-bold text-white">-340 kg CO₂</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-6 left-4 lg:-left-6 glass-panel border border-slate-700 rounded-2xl p-3 flex items-center gap-3 shadow-xl"
            >
              <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider">CLEAN ENERGY</p>
                <p className="text-xs font-bold text-white">88% Solar</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-1/2 right-4 lg:-right-12 -translate-y-1/2 glass-panel border border-slate-700 rounded-2xl p-3.5 flex flex-col gap-1 shadow-2xl w-36"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-emerald-400 tracking-wider">STREAK</span>
                <span className="text-[9px] text-slate-400">Level 3</span>
              </div>
              <p className="text-sm font-black text-white">🔥 5 Days Green</p>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full w-4/5" />
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Down arrow link indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <span className="text-[10px] uppercase font-bold tracking-widest">Explore Features</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
    </svg>
  );
}
