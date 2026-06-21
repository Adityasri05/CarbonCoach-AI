"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  TrendingDown,
  Globe,
  Award,
  Zap,
  Leaf,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PieChartIcon,
  BarChartIcon
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";
import { motion } from "framer-motion";

export default function TabDashboard() {
  const { carbonScore, monthlyEmissions, greenPoints, level, streak, habits } = useApp();
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [trendTimeframe, setTrendTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Dynamic calculations based on current carbon score
  const scorePercentOfUSAvg = Math.round((carbonScore / 16.0) * 100); // US average is roughly 16 Tons
  const globalTargetPercent = Math.round((2.0 / carbonScore) * 100); // Ideal carbon target is 2.0 Tons

  // Category breakdown mock data based on habits
  const breakdownData = [
    { name: "Transport", value: Math.round(carbonScore * 0.42 * 10) / 10, color: "#10B981" },
    { name: "Energy", value: Math.round(carbonScore * 0.28 * 10) / 10, color: "#14B8A6" },
    { name: "Food", value: Math.round(carbonScore * 0.15 * 10) / 10, color: "#0EA5E9" },
    { name: "Shopping", value: Math.round(carbonScore * 0.10 * 10) / 10, color: "#F59E0B" },
    { name: "Waste", value: Math.round(carbonScore * 0.05 * 10) / 10, color: "#EF4444" },
  ];

  // Daily, weekly, monthly trends data
  const trendDataMap = {
    daily: [
      { name: "Mon", Emissions: 18 },
      { name: "Tue", Emissions: 15 },
      { name: "Wed", Emissions: 19 },
      { name: "Thu", Emissions: 14 },
      { name: "Fri", Emissions: 21 },
      { name: "Sat", Emissions: 12 },
      { name: "Sun", Emissions: 10 },
    ],
    weekly: [
      { name: "Wk 1", Emissions: 135 },
      { name: "Wk 2", Emissions: 130 },
      { name: "Wk 3", Emissions: 125 },
      { name: "Wk 4", Emissions: 120 },
      { name: "Wk 5", Emissions: 110 },
    ],
    monthly: [
      { name: "Jan", Emissions: 580 },
      { name: "Feb", Emissions: 560 },
      { name: "Mar", Emissions: 550 },
      { name: "Apr", Emissions: 535 },
      { name: "May", Emissions: 530 },
      { name: "Jun", Emissions: 520 },
    ],
  };

  const currentTrendData = trendDataMap[trendTimeframe];

  const aiInsights = [
    {
      id: 1,
      title: "Transportation Alert",
      desc: `Your transportation contributes 42% of your footprint (${breakdownData[0].value} Tons CO₂).`,
      impact: "High Impact Area",
      action: "Try active transit",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
    },
    {
      id: 2,
      title: "Smart Transit Tip",
      desc: "Using public transport 3 days/week could save 240 kg CO₂ annually.",
      impact: "Saves 240 kg CO₂/yr",
      action: "Review routes",
      color: "border-teal-500/30 text-teal-400 bg-teal-500/5",
    },
    {
      id: 3,
      title: "Energy Efficiency Tip",
      desc: "Reducing AC usage by 1 hour/day can reduce emissions by 110 kg/year.",
      impact: "Saves 110 kg CO₂/yr",
      action: "Set timers",
      color: "border-sky-500/30 text-sky-400 bg-sky-500/5",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
    })
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Eco Dashboard</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Welcome back! Real-time carbon statistics & smart tips.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="glass-panel text-[11px] px-3 py-1.5 rounded-full border border-slate-700/50 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            🔥 {streak} Day Streak
          </span>
          <span className="glass-panel text-[11px] px-3 py-1.5 rounded-full border border-slate-700/50 text-sky-400 font-bold">
            🏆 Level {level}
          </span>
        </div>
      </div>

      {/* Top Metrics Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Carbon Score */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-700/40 flex flex-col justify-between min-h-[130px] sm:min-h-[140px] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Carbon Score</span>
            <div className="p-1.5 sm:p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Globe size={16} />
            </div>
          </div>
          <div className="mt-1.5">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{carbonScore} <span className="text-[10px] sm:text-xs font-normal text-slate-400">T CO₂/yr</span></p>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <TrendingDown size={12} /> {scorePercentOfUSAvg}% of US avg
            </p>
          </div>
        </motion.div>

        {/* Monthly Emissions */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-700/40 flex flex-col justify-between min-h-[130px] sm:min-h-[140px] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-teal-500/10 transition-colors" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly</span>
            <div className="p-1.5 sm:p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-1.5">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{monthlyEmissions} <span className="text-[10px] sm:text-xs font-normal text-slate-400">kg CO₂</span></p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
              Target: <span className="text-teal-400 font-bold">166 kg</span>
            </p>
          </div>
        </motion.div>

        {/* Reduction Goal */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-700/40 flex flex-col justify-between min-h-[130px] sm:min-h-[140px] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Reduction</span>
            <div className="p-1.5 sm:p-2 bg-sky-500/10 text-sky-400 rounded-xl">
              <Leaf size={16} />
            </div>
          </div>
          <div className="mt-1.5">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">72% <span className="text-[10px] sm:text-xs font-normal text-slate-400">Done</span></p>
            {/* Simple progress bar */}
            <div className="w-full bg-slate-700/40 rounded-full h-1.5 mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="bg-gradient-to-r from-sky-500 to-sky-400 h-1.5 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Green Points */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-700/40 flex flex-col justify-between min-h-[130px] sm:min-h-[140px] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Points</span>
            <div className="p-1.5 sm:p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Award size={16} />
            </div>
          </div>
          <div className="mt-1.5">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{greenPoints} <span className="text-[10px] sm:text-xs font-normal text-slate-400">Pts</span></p>
            <p className="text-[10px] sm:text-[11px] text-amber-400 mt-0.5">
              Redeemable rewards
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Carbon Breakdown Chart */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/40 lg:col-span-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Carbon Breakdown</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">CO₂ by categories</p>
            </div>
            
            {/* Toggle switch */}
            <div className="flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/50">
              <button
                onClick={() => setChartType("pie")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  chartType === "pie" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <PieChartIcon size={14} />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  chartType === "bar" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <BarChartIcon size={14} />
              </button>
            </div>
          </div>

          <div className="h-52 sm:h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              ) : (
                <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Custom Legends list */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2 mt-3 text-[10px]">
            {breakdownData.map((d, index) => (
              <div key={index} className="flex items-center gap-1 text-slate-300">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carbon Trend Graph */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/40 lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Emission Trend</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Historical eco-habits tracker</p>
            </div>

            {/* Timeframe selector */}
            <div className="flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/50 text-[11px]">
              {(["daily", "weekly", "monthly"] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => setTrendTimeframe(time)}
                  className={`px-2.5 sm:px-3 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                    trendTimeframe === time
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="h-52 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Emissions"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  activeDot={{ r: 5 }}
                  dot={{ r: 3, stroke: "#10B981", strokeWidth: 2, fill: "#0F172A" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mt-2 border-t border-slate-800/60 pt-3">
            <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1">
              <TrendingDown size={12} className="text-emerald-400" /> Emissions reduced by 12% from last month
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold">Keep it up!</span>
          </div>
        </div>

      </div>

      {/* AI Insights & Recommendations Panel */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">AI Recommendations</h3>
            <p className="text-[10px] sm:text-xs text-slate-400">Personalized climate-action plan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {aiInsights.map((ins, idx) => (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between min-h-[150px] sm:min-h-[160px] ${ins.color}`}
            >
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-200 border border-slate-700/30 px-2 py-0.5 rounded-full w-fit block">
                  {ins.title}
                </span>
                <p className="text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed">
                  {ins.desc}
                </p>
              </div>

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/20 text-[10px] sm:text-[11px]">
                <span className="font-semibold text-emerald-400">{ins.impact}</span>
                <button className="flex items-center gap-1 hover:gap-1.5 transition-all text-slate-300 font-bold hover:text-white cursor-pointer">
                  {ins.action} <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
