"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Sparkles, Sliders, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function TabCarbonTwin() {
  const { carbonScore } = useApp();
  
  // Simulation Sliders state
  const [publicTransport, setPublicTransport] = useState(1); // days/week
  const [meatMeals, setMeatMeals] = useState(12); // meals/week
  const [electricity, setElectricity] = useState(250); // kWh/month
  const [flights, setFlights] = useState(3); // flights/year

  // Compute simulated carbon footprint in real-time during render
  const transportCarbon = ((7 - publicTransport) * 52 * 8) / 1000; // less public transport = more personal car driving
  const meatCarbon = (meatMeals * 52 * 2.5) / 1000; // 2.5 kg CO2 per meat meal
  const energyCarbon = (electricity * 12 * 0.4) / 1000; // 0.4 kg CO2 per kWh
  const flightCarbon = flights * 0.9; // 0.9 Tons per flight average

  // baseline constants
  const wasteCarbon = 0.5;
  const shoppingCarbon = 0.6;
  
  const futureScore = parseFloat((transportCarbon + meatCarbon + energyCarbon + flightCarbon + wasteCarbon + shoppingCarbon).toFixed(1));
  const reductionPct = carbonScore > 0 ? Math.max(0, Math.round(((carbonScore - futureScore) / carbonScore) * 100)) : 0;

  // Determine tree health / visualization factors based on reduction
  const getVisualizationState = () => {
    if (reductionPct <= 5) return { text: "Heavy Smog", color: "text-slate-500", opacity: 0.8, treeScale: 0.8, leafColor: "#64748b" };
    if (reductionPct <= 15) return { text: "Partly Cloudy", color: "text-amber-500", opacity: 0.5, treeScale: 0.9, leafColor: "#a3e635" };
    if (reductionPct <= 30) return { text: "Eco Conscious", color: "text-teal-400", opacity: 0.2, treeScale: 1.0, leafColor: "#10b981" };
    return { text: "Lush & Carbon Negative", color: "text-emerald-400", opacity: 0, treeScale: 1.15, leafColor: "#059669" };
  };

  const vis = getVisualizationState();

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2">
          AI Carbon Twin <Sparkles size={22} className="text-emerald-400 animate-pulse" />
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Simulate lifestyle adjustments in real-time to preview your future environmental impact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Sliders Controller Panel */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/40 lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <Sliders size={16} className="text-emerald-400" />
            <h2 className="font-bold text-slate-100 text-sm">Lifestyle Simulators</h2>
          </div>

          {/* Slider 1: Public Transport */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <label htmlFor="slider-transport" className="text-slate-300 font-semibold cursor-pointer">
                Public Transport / Active Transit
              </label>
              <span className="text-emerald-400 font-black text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">{publicTransport} days/week</span>
            </div>
            <input
              id="slider-transport"
              type="range"
              min="0"
              max="7"
              step="1"
              value={publicTransport}
              onChange={(e) => setPublicTransport(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Car commuter (0 days)</span>
              <span>Daily transit (7 days)</span>
            </div>
          </div>

          {/* Slider 2: Meat Consumption */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <label htmlFor="slider-meat" className="text-slate-300 font-semibold cursor-pointer">
                Meat/Animal Product Meals
              </label>
              <span className="text-emerald-400 font-black text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">{meatMeals} meals/wk</span>
            </div>
            <input
              id="slider-meat"
              type="range"
              min="0"
              max="21"
              step="1"
              value={meatMeals}
              onChange={(e) => setMeatMeals(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Plant-Based (0)</span>
              <span>Heavy meat (21)</span>
            </div>
          </div>

          {/* Slider 3: Electricity Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <label htmlFor="slider-electricity" className="text-slate-300 font-semibold cursor-pointer">
                Monthly Electricity
              </label>
              <span className="text-emerald-400 font-black text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">{electricity} kWh</span>
            </div>
            <input
              id="slider-electricity"
              type="range"
              min="50"
              max="600"
              step="10"
              value={electricity}
              onChange={(e) => setElectricity(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Off-grid (50 kWh)</span>
              <span>High HVAC (600 kWh)</span>
            </div>
          </div>

          {/* Slider 4: Flight Frequency */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <label htmlFor="slider-flights" className="text-slate-300 font-semibold cursor-pointer">
                Annual Flights
              </label>
              <span className="text-emerald-400 font-black text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">{flights} flights/yr</span>
            </div>
            <input
              id="slider-flights"
              type="range"
              min="0"
              max="12"
              step="1"
              value={flights}
              onChange={(e) => setFlights(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>No flying (0)</span>
              <span>Frequent flyer (12)</span>
            </div>
          </div>

          {/* Twin AI Insights Summary */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/60 flex items-start gap-3">
            <Info size={14} className="text-sky-400 mt-0.5 shrink-0" />
            <div className="text-[11px] text-slate-400 space-y-0.5">
              <p className="font-semibold text-slate-300">How this works:</p>
              <p>Your Carbon Twin compares your baseline of <strong className="text-white">{carbonScore} Tons</strong> against adjustments in real-time.</p>
            </div>
          </div>
        </div>

        {/* Visual Impact Dashboard Display */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/40 lg:col-span-5 flex flex-col justify-between items-center text-center gap-4 sm:gap-6 relative overflow-hidden">
          
          {/* Smog Fog overlay based on visa state */}
          <div
            className="absolute inset-0 bg-slate-800 pointer-events-none transition-opacity duration-500"
            style={{ opacity: vis.opacity }}
          />

          <div className="relative z-10 w-full">
            <h3 className="font-bold text-slate-100 text-sm">Simulated Impact</h3>
            <p className="text-[11px] text-slate-400">State: <span className={`font-bold ${vis.color}`}>{vis.text}</span></p>
          </div>

          {/* Dynamic SVG Tree visualization */}
          <motion.div
            animate={{ scale: vis.treeScale }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            className="w-28 h-28 sm:w-36 sm:h-36 relative z-10"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
              {/* Ground */}
              <ellipse cx="50" cy="90" rx="30" ry="6" fill="#1e293b" />
              <ellipse cx="50" cy="90" rx="20" ry="3" fill="#10b981" fillOpacity="0.4" />
              
              {/* Trunk */}
              <path d="M47,90 L47,55 Q50,45 42,40 L45,38 Q50,44 53,55 L53,90 Z" fill="#78350f" />
              
              {/* Branch left */}
              <path d="M48,65 Q42,55 35,58 L34,55 Q42,52 49,60 Z" fill="#78350f" />
              
              {/* Branch right */}
              <path d="M52,60 Q58,50 68,52 L68,55 Q59,53 52,58 Z" fill="#78350f" />
              
              {/* Leaves (Color changes dynamically based on simulation) */}
              <circle cx="50" cy="35" r="16" fill={vis.leafColor} fillOpacity="0.85" className="transition-colors duration-500" />
              <circle cx="38" cy="45" r="12" fill={vis.leafColor} fillOpacity="0.8" className="transition-colors duration-500" />
              <circle cx="62" cy="48" r="13" fill={vis.leafColor} fillOpacity="0.8" className="transition-colors duration-500" />
              <circle cx="48" cy="22" r="10" fill={vis.leafColor} fillOpacity="0.9" className="transition-colors duration-500" />
              <circle cx="58" cy="28" r="12" fill={vis.leafColor} fillOpacity="0.85" className="transition-colors duration-500" />
            </svg>
          </motion.div>

          {/* Numbers comparison */}
          <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-800/80 pt-4 sm:pt-6 relative z-10">
            <div className="text-left border-r border-slate-800/80 pr-2">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Future Score</span>
              <p className="text-xl sm:text-2xl font-black text-white">{futureScore} <span className="text-[10px] font-normal text-slate-400">T/yr</span></p>
            </div>
            
            <div className="text-left pl-2">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">CO₂ Reduction</span>
              <p className={`text-xl sm:text-2xl font-black ${reductionPct > 0 ? "text-emerald-400" : "text-slate-400"}`}>
                {reductionPct > 0 ? `-${reductionPct}%` : "0%"}
              </p>
            </div>
          </div>

          {/* Action button */}
          {reductionPct > 0 ? (
            <button
              onClick={() => {
                alert(`Habits lock-in simulated! You would save ${Math.round((carbonScore - futureScore) * 1000)} kg CO₂ per year by applying this twin profile.`);
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm relative z-10"
            >
              Apply Future Lifestyle Profile
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 italic relative z-10">
              Adjust sliders to simulate carbon offsets
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
