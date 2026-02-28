import React, { useState, lazy, Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { DRINKS } from "./data/drinks";
import ExploreTab from "./components/ExploreTab";
import { Coffee, Dices, Map } from "lucide-react";

const MoodTab = lazy(() => import("./components/MoodTab"));
const FlavorTab = lazy(() => import("./components/FlavorTab"));

export default function App() {
  const [tab, setTab] = useState("explore");
  const [resetKey, setResetKey] = useState(0);

  // State lifting for Flavor map cross-navigation
  const [exploreFlavorSearch, setExploreFlavorSearch] = useState(null);

  const goToExploreWithFlavors = (flavors) => {
    setExploreFlavorSearch(flavors);
    setTab("explore");
  };

  const navButton = (t, label, Icon) => {
    const active = tab === t;
    return (
      <button
        key={t}
        onClick={() => setTab(t)}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300
          ${active
            ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/25 scale-105'
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
        `}
      >
        <Icon size={16} />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      {/* Background Decor — hidden on mobile (kills iOS Safari perf) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 hidden lg:block">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-sky-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 pb-8 border-b border-white/5">
          <div className="inline-block mb-3 cursor-pointer" onClick={() => { setTab("explore"); setResetKey(k => k + 1); }}>
            <span className="text-4xl filter drop-shadow-lg scale-110 inline-block">❤️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 cursor-pointer" onClick={() => { setTab("explore"); setResetKey(k => k + 1); }}>
            Dutch Bros Secret Menu
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-medium max-w-xl mx-auto mb-8">
            Discover <span className="text-blue-400 font-black">{DRINKS.length}</span> secret flavor combos, find your new favorite, or roll the dice.
          </p>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {navButton("explore", "Explore", Coffee)}
            {navButton("mood", "Pick My Drink", Dices)}
            {navButton("flavors", "Flavor Map", Map)}
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[50vh]">
          {tab === "explore" && <ExploreTab initialFlavors={exploreFlavorSearch} onInitialFlavorsConsumed={() => setExploreFlavorSearch(null)} resetKey={resetKey} />}
          <Suspense fallback={null}>
            {tab === "mood" && <MoodTab />}
            {tab === "flavors" && <FlavorTab goToExploreWithFlavors={goToExploreWithFlavors} />}
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-gray-500 pb-4">
          <p>Not affiliated with Dutch Bros Coffee. Just built by fans, for fans.</p>
        </footer>
      </div>
      <SpeedInsights />
    </div>
  );
}
