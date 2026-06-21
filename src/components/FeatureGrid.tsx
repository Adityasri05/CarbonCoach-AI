"use client";

import React from "react";
import {
  Globe,
  Bot,
  Calendar,
  Lightbulb,
  Award,
  Flame,
  Users,
  Camera,
  MessageSquare,
  Gift,
  LucideIcon
} from "lucide-react";
import { motion, Variants } from "framer-motion";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  badge?: string;
}

const features: FeatureItem[] = [
  {
    icon: Globe,
    title: "Smart Carbon Score",
    description: "Calculate your personal carbon footprint using lifestyle data with instant comparative insights.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Bot,
    title: "AI Carbon Twin",
    description: "Simulate future scenarios, slide lifestyle adjusters, and predict emission reductions.",
    color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    badge: "Interactive",
  },
  {
    icon: Calendar,
    title: "Daily Carbon Tracker",
    description: "Monitor emissions from travel, food, shopping, and energy usage on a calendar timeline.",
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: Lightbulb,
    title: "AI Recommendations",
    description: "Personalized, hyper-localized suggestions for your home energy, daily transit, and eating habits.",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badge: "Smart",
  },
  {
    icon: Award,
    title: "Eco Challenges",
    description: "Participate in weekly and monthly sustainability challenges to slash your carbon footprint.",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Flame,
    title: "Eco Streaks",
    description: "Build green habits through gamification and earn badges. Stay consistent to boost multipliers.",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: Users,
    title: "Community League",
    description: "Compete with friends, family, and global communities to see who can make the greatest impact.",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Camera,
    title: "Carbon Impact Camera",
    description: "Upload photos of meals, vehicles, or appliances to estimate emissions using computer vision.",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    badge: "AI Vision",
  },
  {
    icon: MessageSquare,
    title: "AI Sustainability Assistant",
    description: "Ask climate-related questions, calculate specific carbon outputs, and receive guided actions.",
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Gift,
    title: "Green Rewards",
    description: "Earn Green Points for good habits, redeem eco-coupons, plant physical trees, or donate to NGOs.",
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function FeatureGrid() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/60" id="features">
      <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">CarbonCoach Capabilities</h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
          Complete Toolkit for a Carbon-Negative Life
        </h3>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Unlock modern tools, computer vision scanner, and advanced simulations powered by AI to track, minimize, and reward your green journey.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col gap-4 relative group"
            >
              {feat.badge && (
                <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {feat.badge}
                </span>
              )}
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.color} shrink-0`}>
                <Icon size={24} />
              </div>

              <div className="flex flex-col gap-1.5">
                <h4 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
