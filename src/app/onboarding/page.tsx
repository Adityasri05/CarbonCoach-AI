"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Leaf, ArrowRight, ArrowLeft, Check, Compass, Car, Flame, Home as HomeIcon, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Onboarding forms state
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    country: "United States",
    occupation: "",
  });

  const [habits, setHabits] = useState({
    travelDistance: 20,
    vehicleType: "Gasoline",
    fuelType: "Petrol",
    electricityBill: 100,
    acUsage: 3,
    appliances: [] as string[],
    foodHabit: "Non-Vegetarian",
    shoppingFrequency: "Monthly",
    recyclingHabits: "Sometimes",
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      // Complete onboarding and save to state
      completeOnboarding({ ...profile }, { ...habits });
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleApplianceToggle = (appliance: string) => {
    setHabits((prev) => {
      const exists = prev.appliances.includes(appliance);
      return {
        ...prev,
        appliances: exists
          ? prev.appliances.filter((a) => a !== appliance)
          : [...prev.appliances, appliance],
      };
    });
  };

  // Steps definitions
  const stepsTitles = [
    "Personal Profile",
    "Transit Habits",
    "Home Utility",
    "Eating Habits",
    "Shopping & Waste",
  ];

  const stepsIcons = [Compass, Car, HomeIcon, Flame, ShoppingBag];

  const getStepProgressPct = () => {
    return Math.round(((step - 1) / (totalSteps - 1)) * 100);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-between py-12 px-6 relative overflow-hidden font-sans">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Leaf size={18} />
          </div>
          <span className="font-black text-base text-white">CarbonCoach AI</span>
        </div>
        <span className="text-xs text-slate-500 font-bold">Onboarding Wizard</span>
      </header>

      {/* Main card */}
      <main className="max-w-md w-full mx-auto bg-slate-900/60 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative z-10 my-8 flex flex-col justify-between min-h-[460px]">
        
        {/* Step Progress Info */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              {React.createElement(stepsIcons[step - 1], { size: 14 })}
              {stepsTitles[step - 1]}
            </span>
            <span>Step {step} of {totalSteps}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <motion.div
              animate={{ width: `${getStepProgressPct()}%` }}
              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Wizard Form Sections */}
        <div className="py-6 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-xl font-black text-white">Tell us about yourself</h2>
                  <p className="text-xs text-slate-400 mt-1">Let's set up your custom coach profile.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Full Name</label>
                    <input
                      type="text"
                      placeholder="Alex Rivera"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold block">Age</label>
                      <input
                        type="number"
                        placeholder="26"
                        value={profile.age}
                        onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold block">Occupation</label>
                      <input
                        type="text"
                        placeholder="Designer"
                        value={profile.occupation}
                        onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Transit habits */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-xl font-black text-white">Transit & Commuting</h2>
                  <p className="text-xs text-slate-400 mt-1">Daily transportation statistics represent up to 40% of footprints.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Daily Travel Distance: {habits.travelDistance} km</label>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      step="5"
                      value={habits.travelDistance}
                      onChange={(e) => setHabits({ ...habits, travelDistance: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Primary Vehicle Class</label>
                    <select
                      value={habits.vehicleType}
                      onChange={(e) => setHabits({ ...habits, vehicleType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Gasoline">Gasoline Car (SUV / Sedan)</option>
                      <option value="Diesel">Diesel Vehicle</option>
                      <option value="Hybrid">Hybrid / HEV</option>
                      <option value="Electric">Electric Vehicle (EV)</option>
                      <option value="None">None / Walk / Public Transit</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Utility bills */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-xl font-black text-white">Home Energy Profile</h2>
                  <p className="text-xs text-slate-400 mt-1">Electricity usage is key to reducing utility carbon loads.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold block">Monthly Power Bill (USD)</label>
                      <input
                        type="number"
                        value={habits.electricityBill}
                        onChange={(e) => setHabits({ ...habits, electricityBill: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold block">Daily AC Runtime (Hrs)</label>
                      <input
                        type="number"
                        value={habits.acUsage}
                        onChange={(e) => setHabits({ ...habits, acUsage: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs text-slate-400 font-semibold block">Appliances Owned</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {["refrigerator", "washing_machine", "clothes_dryer", "dishwasher"].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => handleApplianceToggle(app)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                            habits.appliances.includes(app)
                              ? "border-emerald-500 bg-emerald-500/5 text-slate-200"
                              : "border-slate-800 text-slate-500 hover:border-slate-700"
                          }`}
                        >
                          <span className="capitalize">{app.replace("_", " ")}</span>
                          {habits.appliances.includes(app) && <Check size={14} className="text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Food diets */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-xl font-black text-white">Eating & Dietary Habits</h2>
                  <p className="text-xs text-slate-400 mt-1">Meat production generates up to 10x carbon load of plant farming.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-col gap-2.5">
                    {["Vegan", "Vegetarian", "Eggetarian", "Non-Vegetarian"].map((diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => setHabits({ ...habits, foodHabit: diet })}
                        className={`p-4 rounded-xl border text-left flex justify-between items-center cursor-pointer transition-all ${
                          habits.foodHabit === diet
                            ? "border-emerald-500 bg-emerald-500/5 text-emerald-300 font-bold"
                            : "border-slate-800 hover:border-slate-700 text-slate-400"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs sm:text-sm text-slate-200">{diet}</p>
                          <p className="text-[10px] text-slate-500">
                            {diet === "Vegan" ? "Low carbon intensity profile" : diet === "Non-Vegetarian" ? "Standard meat intensive" : "Moderate carbon footprint"}
                          </p>
                        </div>
                        {habits.foodHabit === diet && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Waste & shopping */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-xl font-black text-white">Shopping & Recycling</h2>
                  <p className="text-xs text-slate-400 mt-1">Wrap up with your trash and e-commerce habits.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Online E-commerce Frequency</label>
                    <select
                      value={habits.shoppingFrequency}
                      onChange={(e) => setHabits({ ...habits, shoppingFrequency: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    >
                      <option value="Rarely">Rarely (Eco-conscious shopper)</option>
                      <option value="Monthly">Monthly Shopper</option>
                      <option value="Weekly">Weekly (High delivery footprint)</option>
                      <option value="Daily">Daily Shopper</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Recycling commitment</label>
                    <select
                      value={habits.recyclingHabits}
                      onChange={(e) => setHabits({ ...habits, recyclingHabits: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    >
                      <option value="Always">Always (Sort compost, plastic, paper)</option>
                      <option value="Sometimes">Sometimes recycle</option>
                      <option value="Never">Rarely/Never recycle</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 border-t border-slate-800/80 pt-6 mt-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 py-3 rounded-xl text-xs sm:text-sm font-black cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all ml-auto"
          >
            {step === totalSteps ? "Finish Onboarding" : "Continue"}
            <ArrowRight size={16} />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-[10px] text-slate-600 z-10">
        Your data is saved locally on your client browser environment. No tracking tags active.
      </footer>

    </div>
  );
}
