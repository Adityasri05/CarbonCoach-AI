"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LandingHero from "@/components/LandingHero";
import FeatureGrid from "@/components/FeatureGrid";
import { Leaf, Shield, HeartHandshake, Zap, MessageSquare, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleGetStarted = () => {
    router.push("/onboarding");
  };

  const handleCalculate = () => {
    router.push("/onboarding?startCalc=true");
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition-all">
              <Leaf size={18} className="rotate-[-10deg] group-hover:rotate-[10deg] transition-transform" />
            </div>
            <span className="font-black text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              CarbonCoach <span className="text-emerald-400">AI</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#impact" className="hover:text-white transition-colors">Our Impact</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/auth" className="hover:text-white transition-colors">Sign In</Link>
            <button
              onClick={handleGetStarted}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold hover:scale-[1.02] active:scale-95 text-xs"
            >
              Get Started
            </button>
          </nav>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-950 border-b border-slate-900 py-4 px-6 flex flex-col gap-4 text-sm font-semibold text-slate-400"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Features
            </a>
            <a
              href="#impact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Our Impact
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              FAQ
            </a>
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Sign In
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleGetStarted();
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-xl font-bold transition-all text-xs"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </header>

      {/* Main Sections */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <LandingHero onGetStarted={handleGetStarted} onCalculate={handleCalculate} />

        {/* Feature Cards Grid (10 items) */}
        <FeatureGrid />

        {/* Impact stats section */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/60" id="impact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Making a Difference</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Collective actions build <br />
                global impact.
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                By gamifying climate actions and utilizing localized data models, CarbonCoach AI inspires individuals to coordinate and sustain green lifestyles, achieving measurable emission reductions.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl h-fit">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-200">Verified Climate Offsets</h4>
                    <p className="text-xs sm:text-sm text-slate-400">All points spent on planting trees are tracked through audited ecological agencies.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl h-fit">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-200">Hyper-localized Data</h4>
                    <p className="text-xs sm:text-sm text-slate-400">Utility carbon intensity coefficients update daily based on local regional power grid grids.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual card mockup */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-700/50 flex flex-col gap-6 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Global Leaderboard
                </span>
                <span className="text-xs text-slate-500">Weekly Update</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-amber-400">🥇</span>
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">SC</span>
                    <span className="text-xs font-bold text-white">Sophia Carter</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">-38% CO₂</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-400">🥈</span>
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">LJ</span>
                    <span className="text-xs font-bold text-white">Liam Johnson</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">-32% CO₂</span>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500">
                Join 45,000+ others cutting footprint outputs!
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto w-full border-t border-slate-800/60" id="faq">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">FAQ</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-slate-200">How is my carbon footprint calculated?</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                CarbonCoach AI uses localized lifestyle data (distance travelled, vehicle fuel economy, monthly electricity grid mix, food items consumed) against global EPA coefficients to approximate your yearly carbon dioxide equivalent (CO₂e) tonnage.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-slate-200">How do I redeem points?</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Completing weekly challenges and uploading photo scans grants Green Points. Spend these points in the marketplace tab to plant native trees, clean up plastic trash from beaches, or fetch organic merchandise discounts.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Leaf size={18} />
            </div>
            <span className="font-black text-lg text-white">CarbonCoach AI</span>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 CarbonCoach AI. Built for winning green hackathons. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
