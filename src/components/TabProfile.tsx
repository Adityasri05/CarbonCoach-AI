"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { User, MapPin, Briefcase, Calendar, ShieldCheck, Flame, Compass } from "lucide-react";
import Image from "next/image";

export default function TabProfile() {
  const { user, level, streak, greenPoints, challenges } = useApp();

  const completedCount = challenges.filter((c) => c.status === "completed").length;
  
  // Calculate equivalents based on approximate savings (baseline 12 Tons vs current 6.2 Tons = 5.8 Tons saved)
  const co2SavedTons = 5.8;
  const treesPlantedEquivalent = Math.round(co2SavedTons * 45); // ~45 trees absorb 1 ton CO2 in a year
  const carMilesEquivalent = Math.round(co2SavedTons * 2400); // 2400 miles per ton CO2 average
  const flightEquivalent = Math.round(co2SavedTons * 1.2); // ~1.2 tons per flight

  const badges = [
    {
      id: "first_step",
      name: "First Step",
      desc: "Completed onboarding profile setup",
      icon: "🌱",
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    {
      id: "streak_5",
      name: "Habit Master",
      desc: "Maintained a 5-day eco streak",
      icon: "🔥",
      color: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    },
    {
      id: "challenger",
      name: "Eco Challenger",
      desc: "Completed your first weekly challenge",
      icon: "🏆",
      color: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    },
    {
      id: "expert",
      name: "Carbon Coach Hero",
      desc: "Reached level 3 status",
      icon: "👑",
      color: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          Carbon Coach Profile <User size={28} className="text-emerald-400" />
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-medium">
          Check your eco-rank, achievements, streaks, and impact multipliers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* User Card info (Left) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-700/50 lg:col-span-4 flex flex-col items-center text-center gap-4 relative overflow-hidden">
          {/* Avatar mockup */}
          <div className="relative mt-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400 overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                alt="Profile Avatar"
                unoptimized
              />
            </div>
            <span className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full border border-slate-900 shadow">
              Lvl {level}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
            <p className="text-xs text-emerald-400 font-bold tracking-wider flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> VERIFIED CARBON HERO
            </p>
          </div>

          {/* User metadata tags */}
          <div className="w-full border-t border-slate-800/80 pt-4 flex flex-col gap-2.5 text-left text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <MapPin size={14} className="text-slate-500" />
              <span>Location: <strong className="text-slate-200">{user.country}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Briefcase size={14} className="text-slate-500" />
              <span>Occupation: <strong className="text-slate-200">{user.occupation}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar size={14} className="text-slate-500" />
              <span>Joined: <strong className="text-slate-200">June 2026</strong></span>
            </div>
          </div>

          {/* Mini streak and points bar */}
          <div className="w-full bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="border-r border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Eco Streak</span>
              <p className="text-base font-black text-orange-400 flex items-center justify-center gap-0.5 mt-0.5">
                <Flame size={16} /> {streak} Days
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Green Balance</span>
              <p className="text-base font-black text-amber-400 mt-0.5">{greenPoints} Pts</p>
            </div>
          </div>
        </div>

        {/* Environmental Impact Summary (Right) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-700/50 lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Compass size={18} className="text-emerald-400" />
            <h2 className="font-bold text-slate-100 text-sm sm:text-base">Environmental Impact Summary</h2>
          </div>

          {/* Metric equivalence calculations grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex flex-col justify-between h-28">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Native Trees Planted</span>
              <div>
                <p className="text-3xl font-black text-emerald-400">{treesPlantedEquivalent}</p>
                <p className="text-[10px] text-slate-500 mt-1">equivalency in carbon absorption</p>
              </div>
            </div>
            
            <div className="p-4 bg-teal-500/5 rounded-xl border border-teal-500/10 flex flex-col justify-between h-28">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Road Trips Offset</span>
              <div>
                <p className="text-3xl font-black text-teal-400">{carMilesEquivalent.toLocaleString()} <span className="text-xs font-normal">mi</span></p>
                <p className="text-[10px] text-slate-500 mt-1">equivalent vehicle miles avoided</p>
              </div>
            </div>

            <div className="p-4 bg-sky-500/5 rounded-xl border border-sky-500/10 flex flex-col justify-between h-28">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Flights Compensated</span>
              <div>
                <p className="text-3xl font-black text-sky-400">{flightEquivalent} <span className="text-xs font-normal">flights</span></p>
                <p className="text-[10px] text-slate-500 mt-1">transatlantic flight equivalent</p>
              </div>
            </div>
          </div>

          {/* Badges Achievements grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Achievements Badges ({badges.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 ${badge.color}`}
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <p className="text-xs font-black text-slate-100">{badge.name}</p>
                    <p className="text-[9px] text-slate-400 leading-tight mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Stats details list */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
            <div>
              <p>Completed Challenges: <strong className="text-white">{completedCount}</strong></p>
              <p className="mt-1">Active Carbon Profile: <strong className="text-emerald-400">Active</strong></p>
            </div>
            <div>
              <p>Redeemed Rewards: <strong className="text-white">3</strong></p>
              <p className="mt-1">Eco Standing: <strong className="text-white">Top 5%</strong></p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
