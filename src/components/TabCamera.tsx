"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Camera, Image as ImageIcon, Sparkles, Check, ArrowRight, RefreshCw, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TabCamera() {
  const { cameraScans, triggerCameraScan } = useApp();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const presets = [
    {
      id: "meal",
      name: "Meal (Beef Burger)",
      desc: "Estimate food emissions",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    },
    {
      id: "vehicle",
      name: "Vehicle (SUV)",
      desc: "Calculate transport outputs",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    },
    {
      id: "appliance",
      name: "Appliance (Dryer)",
      desc: "Measure energy usage",
      imageUrl: "https://images.unsplash.com/photo-1610557892470-76d747e2db51?w=400&q=80",
    },
  ];

  const handleScanPreset = (id: string) => {
    setSelectedPreset(id);
    setIsScanning(true);
    setScanComplete(false);

    // Mock scan animation for 1.5s
    setTimeout(() => {
      triggerCameraScan(id, presets.find((p) => p.id === id)?.imageUrl || "");
      setIsScanning(false);
      setScanComplete(true);
    }, 1800);
  };

  const latestScan = cameraScans[0];

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2">
          Carbon Camera <Camera size={22} className="text-rose-400" />
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Scan real-world items to measure carbon and find alternatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Scanner Controller Column */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/40 lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <ImageIcon size={16} className="text-rose-400" />
            <h2 className="font-bold text-slate-100 text-sm">Upload or Choose Preset</h2>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleScanPreset(preset.id)}
                disabled={isScanning}
                className={`glass-panel border text-left p-3 sm:p-4 rounded-xl flex flex-col justify-between min-h-[120px] sm:min-h-[140px] cursor-pointer transition-all relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] ${
                  selectedPreset === preset.id
                    ? "border-rose-500 bg-rose-500/5"
                    : "border-slate-800 hover:border-slate-600"
                }`}
              >
                {/* Image backdrop */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundImage: `url(${preset.imageUrl})` }}
                />
                
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-rose-400 tracking-wider bg-rose-500/10 px-1.5 sm:px-2 py-0.5 rounded-full w-fit relative z-10">
                  {preset.id}
                </span>

                <div className="space-y-0.5 relative z-10 mt-auto">
                  <p className="font-bold text-[11px] sm:text-xs text-slate-100 leading-tight">{preset.name}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 leading-snug">{preset.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Upload Mock Zone */}
          <div className="border border-dashed border-slate-700 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-2 bg-slate-900/30 hover:border-slate-500 transition-colors">
            <div className="p-2.5 bg-slate-800 rounded-full text-slate-400">
              <Camera size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Upload a Custom Photo</p>
              <p className="text-[10px] text-slate-500 mt-0.5">JPEG, PNG, HEIC up to 5MB</p>
            </div>
            <button
              onClick={() => handleScanPreset("meal")}
              disabled={isScanning}
              className="mt-1 glass-panel border border-slate-700 hover:border-slate-600 text-slate-300 px-4 py-2 rounded-xl text-[11px] font-semibold cursor-pointer hover:bg-slate-800/40"
            >
              Simulate Upload
            </button>
          </div>
        </div>

        {/* Scan Results Panel */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/40 lg:col-span-5 flex flex-col justify-center items-center relative overflow-hidden min-h-[260px] sm:min-h-[300px]">
          
          <AnimatePresence mode="wait">
            {/* Scanning State */}
            {isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 text-center h-full w-full"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 border border-slate-700 rounded-2xl relative overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
                  {/* Backdrop preset image */}
                  <img
                    src={presets.find((p) => p.id === selectedPreset)?.imageUrl}
                    className="w-full h-full object-cover opacity-40 blur-sm"
                    alt="Scanning"
                  />
                  {/* Laser line animation */}
                  <motion.div
                    animate={{ y: [-70, 70, -70] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_8px_#f43f5e] z-20"
                  />
                  <RefreshCw className="animate-spin text-rose-400 absolute" size={28} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                    Analyzing <Sparkles size={12} className="text-rose-400 animate-pulse" />
                  </p>
                  <p className="text-[10px] text-slate-400">Classifying and calculating emissions...</p>
                </div>
              </motion.div>
            )}

            {/* Scan Complete Results */}
            {scanComplete && latestScan && !isScanning && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-3 sm:gap-4"
              >
                <div className="text-center pb-2 border-b border-slate-800/60">
                  <span className="text-[9px] bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/20 uppercase tracking-widest inline-flex items-center gap-1">
                    <Check size={10} /> Scan Success
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white mt-1.5">Detected: {latestScan.item}</h3>
                </div>

                {/* Main comparison values */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 sm:p-4 bg-slate-900/60 rounded-xl border border-slate-800/60">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Emission</span>
                    <p className="text-base sm:text-lg font-black text-rose-400 mt-0.5">{latestScan.emission} kg CO₂</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Reduction</span>
                    <p className="text-base sm:text-lg font-black text-emerald-400 mt-0.5">{latestScan.reduction}% Saved</p>
                  </div>
                </div>

                {/* Alternative suggestion card */}
                <div className="p-3 sm:p-4 bg-slate-800/80 rounded-xl border border-slate-700/40 flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block">Recommended Swap</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-100">
                    {latestScan.altName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Lowers emissions to <strong className="text-emerald-400">{latestScan.alternative} kg CO₂</strong>.
                  </p>
                </div>

                <div className="text-[10px] text-slate-500 text-center italic">
                  +20 Green Points, +50 XP earned
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!isScanning && !scanComplete && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center gap-2 p-6 text-slate-500"
              >
                <Camera size={40} className="stroke-1 text-slate-600" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-400">Scanner Standby</p>
                  <p className="text-[10px] text-slate-500 max-w-[180px]">Select a preset or upload a photo to start.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Upload/Scan History */}
      {cameraScans.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/40">
          <h3 className="font-bold text-slate-100 mb-3 sm:mb-4 flex items-center gap-2 text-sm">
            Recent Analysis <Eye size={14} className="text-slate-400" />
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {cameraScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-3 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl border border-slate-800/60 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={scan.imageUrl} className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-lg border border-slate-800 shrink-0" alt={`${scan.item} Preview`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{scan.item}</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">{scan.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-[11px] font-extrabold text-rose-400">{scan.emission} kg</p>
                    <p className="text-[9px] text-slate-500">original</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-extrabold text-emerald-400">-{scan.reduction}%</p>
                    <p className="text-[9px] text-slate-500">with swap</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
