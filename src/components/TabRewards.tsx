"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Gift, Leaf, AlertCircle, ShoppingBag, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function TabRewards() {
  const { rewards, greenPoints, redeemReward } = useApp();
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Rewards" },
    { id: "nature", name: "Reforestation" },
    { id: "cleanup", name: "Cleanups" },
    { id: "product", name: "Eco Products" },
    { id: "coupon", name: "Discounts" },
  ];

  const filteredRewards = filter === "all"
    ? rewards
    : rewards.filter((r) => r.category === filter);

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Rewards Marketplace <Gift size={28} className="text-yellow-400" />
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Spend your Green Points to support carbon-saving projects or obtain sustainable products.
          </p>
        </div>

        {/* Dynamic points balance */}
        <div className="glass-panel px-4 py-2 border border-slate-700/50 rounded-xl text-xs flex items-center gap-2">
          <Award size={16} className="text-amber-400" />
          <span className="text-slate-300">Balance: <strong className="text-amber-400 font-bold">{greenPoints} pts</strong></span>
        </div>
      </div>

      {/* Category selector chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
              filter === cat.id
                ? "bg-amber-400 border-amber-400 text-slate-950 font-bold"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of Reward Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRewards.map((item) => {
          const canAfford = greenPoints >= item.pointsRequired;
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between h-[270px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

              {/* Card content */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/30">
                    {item.category}
                  </span>
                  <span className="text-sm font-black text-amber-400">
                    {item.pointsRequired} Pts
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                  {item.description}
                </p>
              </div>

              {/* Impact Display & Action */}
              <div className="space-y-4 pt-4 border-t border-slate-800/60 mt-4 relative z-10">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10 w-fit">
                  <Leaf size={14} />
                  <span>Impact: {item.impactGenerated}</span>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] text-slate-500 font-bold">
                    {item.redeemedCount > 0 ? `Redeemed: ${item.redeemedCount} times` : "Not redeemed yet"}
                  </span>
                  
                  <button
                    onClick={() => redeemReward(item.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow transition-all flex items-center gap-1.5 ${
                      canAfford
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:scale-[1.03] active:scale-95"
                        : "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={14} />
                    Redeem Reward
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footnote information */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Green rewards items are simulated. For production, CarbonCoach AI connects with verified carbon offset providers (Gold Standard) and sustainable commerce vendors to issue direct coupons or certificates.
        </p>
      </div>

    </div>
  );
}
