"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Award, Flame, Leaf, Check, Plus, Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function TabChallenges() {
  const { challenges, joinChallenge, updateChallengeProgress } = useApp();

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2">
          Eco Challenges <Award size={22} className="text-purple-400" />
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Complete carbon-saving challenges. Earn green points and XP multipliers.
        </p>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {challenges.map((ch, idx) => {
          const isJoined = ch.status === "joined";
          const isCompleted = ch.status === "completed";

          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -3 }}
              className={`glass-panel rounded-2xl p-4 sm:p-5 border flex flex-col justify-between min-h-[220px] sm:min-h-[240px] relative overflow-hidden transition-all ${
                isCompleted
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : isJoined
                  ? "border-purple-500/30 bg-purple-500/5"
                  : "border-slate-700/40"
              }`}
            >
              {/* Card Header */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    isCompleted
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : isJoined
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700/50"
                  }`}>
                    {ch.status.replace("_", " ")}
                  </span>
                  
                  <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                    🏆 +{ch.points}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mt-1">{ch.title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {ch.description}
                </p>
              </div>

              {/* Card Footer / Progress Action */}
              <div className="space-y-3 pt-3 border-t border-slate-800/40 mt-3">
                
                {/* Progress bar (Only show if joined or completed) */}
                {(isJoined || isCompleted) && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Progress</span>
                      <span>{ch.daysCompleted}/{ch.daysTotal} Days ({ch.progress}%)</span>
                    </div>
                    <div className="w-full bg-slate-700/40 rounded-full h-1.5 overflow-hidden border border-slate-800/60">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ch.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-1.5 rounded-full ${isCompleted ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-purple-500 to-pink-500"}`}
                      />
                    </div>
                  </div>
                )}

                {/* Buttons triggers */}
                <div className="flex gap-2">
                  {!isJoined && !isCompleted && (
                    <button
                      onClick={() => joinChallenge(ch.id)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors border border-slate-700/50 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95"
                    >
                      Join Challenge
                    </button>
                  )}

                  {isJoined && (
                    <>
                      <button
                        onClick={() => updateChallengeProgress(ch.id, 1)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-2.5 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-95"
                      >
                        <Plus size={14} /> Log Day
                      </button>
                      <button
                        onClick={() => updateChallengeProgress(ch.id, ch.daysTotal - ch.daysCompleted)}
                        className="bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700/50 font-bold px-3 py-2.5 rounded-xl text-[11px] cursor-pointer transition-colors"
                        title="Simulate Instant Completion"
                      >
                        Skip
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <div className="w-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5">
                      <Check size={14} /> Completed
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
