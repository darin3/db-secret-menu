import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { DRINKS } from "./data/drinks";
import ExploreTab from "./components/ExploreTab";
import FeedbackModal from "./components/FeedbackModal";
import { Coffee, Dices, Map, MessageSquare } from "lucide-react";

const MoodTab = lazy(() => import("./components/MoodTab"));
const FlavorTab = lazy(() => import("./components/FlavorTab"));
const FeedbackAdmin = lazy(() => import("./pages/FeedbackAdmin"));

export default function App() {
  const navigate = useNavigate();
  const [resetKey, setResetKey] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Dismiss loader and restore scrolling once React mounts
  useEffect(() => {
    const loader = document.getElementById("loader-container");
    if (loader) {
      loader.style.display = "none";
    }
    document.body.style.overflow = "";
  }, []);

  // State lifting for Flavor map cross-navigation
  const [exploreFlavorSearch, setExploreFlavorSearch] = useState(null);

  const goToExploreWithFlavors = (flavors) => {
    setExploreFlavorSearch(flavors);
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/");
    setResetKey(k => k + 1);
  };

  const navLink = (to, label, Icon, end = false) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) => `
        flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300
        ${isActive
          ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/25 scale-105'
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
      `}
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      {/* Background Decor — disabled for testing */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 hidden lg:block">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-sky-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 pb-8 border-b border-white/5">
          <div className="inline-block mb-3 cursor-pointer" onClick={handleLogoClick}>
            <span className="text-4xl filter drop-shadow-lg scale-110 inline-block">❤️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 cursor-pointer" onClick={handleLogoClick}>
            Dutch Bros Secret Menu
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-medium max-w-xl mx-auto mb-8">
            Discover <span className="text-blue-400 font-black">{DRINKS.length}</span> flavor combos, find your new favorite, or roll the dice.
          </p>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {navLink("/", "Explore", Coffee, true)}
            {navLink("/discover", "Pick My Drink", Dices)}
            {navLink("/map", "Flavor Map", Map)}
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[50vh]">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<ExploreTab initialFlavors={exploreFlavorSearch} onInitialFlavorsConsumed={() => setExploreFlavorSearch(null)} resetKey={resetKey} />} />
              <Route path="/discover" element={<MoodTab />} />
              <Route path="/map" element={<FlavorTab goToExploreWithFlavors={goToExploreWithFlavors} />} />
              <Route path="/admin" element={<FeedbackAdmin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-gray-500 pb-12 flex flex-col items-center gap-4">
          <p>An unofficial fan guide. Not affiliated with Dutch Bros Coffee.</p>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/10 hover:shadow-lg hover:shadow-black/20"
          >
            <MessageSquare size={14} />
            <span className="font-medium">Send Feedback</span>
          </button>
        </footer>
      </div>
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
