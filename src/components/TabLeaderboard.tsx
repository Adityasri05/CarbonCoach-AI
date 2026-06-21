"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Users, Trophy, Award, Search, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface BoardUser {
  rank: number;
  name: string;
  avatar: string;
  reduction: number; // %
  points: number;
  isCurrentUser?: boolean;
}

export default function TabLeaderboard() {
  const { user, greenPoints } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const leaderboardUsers: BoardUser[] = [
    {
      rank: 1,
      name: "Sophia Carter",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      reduction: 38,
      points: 2450,
    },
    {
      rank: 2,
      name: "Liam Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      reduction: 32,
      points: 1850,
    },
    {
      rank: 3,
      name: `${user.name} (You)`,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80",
      reduction: 28,
      points: greenPoints,
      isCurrentUser: true,
    },
    {
      rank: 4,
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      reduction: 24,
      points: 1120,
    },
    {
      rank: 5,
      name: "James Smith",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
      reduction: 19,
      points: 980,
    },
  ];

  const filteredUsers = leaderboardUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankMedal = (rank: number) => {
    if (rank === 1) return <span className="text-lg sm:text-xl" title="Gold Medal">🥇</span>;
    if (rank === 2) return <span className="text-lg sm:text-xl" title="Silver Medal">🥈</span>;
    if (rank === 3) return <span className="text-lg sm:text-xl" title="Bronze Medal">🥉</span>;
    return <span className="text-xs font-bold text-slate-500 w-6 text-center">{rank}</span>;
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2">
            Community League <Users size={22} className="text-blue-400" />
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Compete with friends and the global carbon-saving community.
          </p>
        </div>

        {/* Global stats summary card */}
        <div className="glass-panel px-3 py-1.5 border border-slate-700/40 rounded-full text-[11px] flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-400 animate-bounce" />
          <span className="text-slate-300">Standing: <strong className="text-white">#3 globally</strong></span>
        </div>
      </div>

      {/* Top 3 Visual Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-4 max-w-md mx-auto">
        
        {/* Rank 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-1.5 text-center"
        >
          <div className="relative">
            <img
              src={leaderboardUsers[1].avatar}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-slate-400 object-cover"
              alt=""
            />
            <span className="absolute -bottom-0.5 -right-0.5 bg-slate-400 text-slate-950 font-black text-[8px] sm:text-[10px] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-slate-900 shadow">
              2
            </span>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-200 truncate max-w-[70px] sm:max-w-none">{leaderboardUsers[1].name.split(" ")[0]}</p>
            <p className="text-[9px] sm:text-[10px] text-emerald-400 font-extrabold">{leaderboardUsers[1].reduction}%</p>
          </div>
          <div className="w-full bg-slate-800/80 rounded-t-xl h-14 sm:h-20 border-t border-x border-slate-700/50 flex items-center justify-center text-slate-400 text-[11px] sm:text-sm font-black">
            2nd
          </div>
        </motion.div>

        {/* Rank 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="flex flex-col items-center gap-1.5 text-center relative -top-3"
        >
          <div className="absolute -top-5 text-base sm:text-lg animate-bounce">👑</div>
          <div className="relative">
            <img
              src={leaderboardUsers[0].avatar}
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-[3px] border-amber-400 object-cover"
              alt=""
            />
            <span className="absolute -bottom-0.5 -right-0.5 bg-amber-400 text-slate-950 font-black text-[8px] sm:text-[10px] rounded-full w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center border border-slate-900 shadow">
              1
            </span>
          </div>
          <div>
            <p className="text-[11px] sm:text-sm font-black text-white truncate max-w-[70px] sm:max-w-none">{leaderboardUsers[0].name.split(" ")[0]}</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-extrabold">{leaderboardUsers[0].reduction}%</p>
          </div>
          <div className="w-full bg-slate-800/80 rounded-t-xl h-20 sm:h-28 border-t border-x border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-black shadow-2xl">
            1st
          </div>
        </motion.div>

        {/* Rank 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-1.5 text-center"
        >
          <div className="relative">
            <img
              src={leaderboardUsers[2].avatar}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-amber-600 object-cover"
              alt=""
            />
            <span className="absolute -bottom-0.5 -right-0.5 bg-amber-600 text-slate-950 font-black text-[8px] sm:text-[10px] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-slate-900 shadow">
              3
            </span>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-200 truncate max-w-[70px] sm:max-w-none">{leaderboardUsers[2].name.split(" ")[0]}</p>
            <p className="text-[9px] sm:text-[10px] text-emerald-400 font-extrabold">{leaderboardUsers[2].reduction}%</p>
          </div>
          <div className="w-full bg-slate-800/80 rounded-t-xl h-10 sm:h-16 border-t border-x border-slate-700/50 flex items-center justify-center text-amber-600 text-[11px] sm:text-sm font-black">
            3rd
          </div>
        </motion.div>

      </div>

      {/* Search Bar & Standings Table */}
      <div className="glass-panel rounded-2xl border border-slate-700/40 overflow-hidden">
        
        {/* Search header */}
        <div className="p-3 sm:p-4 border-b border-slate-800/60 bg-slate-800/30 flex items-center gap-3">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-100 text-xs w-full placeholder-slate-500 focus:ring-0"
          />
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]">
                <th className="p-3 sm:p-4 w-14 text-center">Rank</th>
                <th className="p-3 sm:p-4">User</th>
                <th className="p-3 sm:p-4 text-center">CO₂ Cut</th>
                <th className="p-3 sm:p-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => (
                <tr
                  key={item.rank}
                  className={`border-b border-slate-800/40 transition-colors hover:bg-slate-800/30 ${
                    item.isCurrentUser ? "bg-emerald-500/5 font-semibold" : ""
                  }`}
                >
                  <td className="p-3 sm:p-4 text-center">
                    {getRankMedal(item.rank)}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img src={item.avatar} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-800 shrink-0" alt="" />
                      <div className="min-w-0">
                        <p className="text-white text-xs truncate">{item.name}</p>
                        {item.isCurrentUser && <p className="text-[9px] text-emerald-400 font-normal">Active streak</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center font-extrabold text-emerald-400 text-xs">
                    {item.reduction}%
                  </td>
                  <td className="p-3 sm:p-4 text-right font-black text-amber-400 text-xs">
                    {item.points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
