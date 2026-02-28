import React, { useState, useMemo } from 'react';
import { DRINKS, FLAVOR_COLORS, isCoreFlavor } from '../data/drinks';
import { BarChart3, Link as LinkIcon, ArrowRight } from 'lucide-react';

export default function FlavorTab({ goToExploreWithFlavors }) {
    const [flavorView, setFlavorView] = useState("frequency");

    const flavorFreq = useMemo(() => {
        const freq = {};
        DRINKS.forEach(d => d.flavors.filter(isCoreFlavor).forEach(f => { freq[f] = (freq[f] || 0) + 1; }));
        return Object.entries(freq).sort((a, b) => b[1] - a[1]);
    }, []);
    const maxFreq = flavorFreq[0]?.[1] || 1;

    const flavorPairs = useMemo(() => {
        const pairs = {};
        DRINKS.forEach(d => {
            const core = d.flavors.filter(isCoreFlavor);
            for (let i = 0; i < core.length; i++)
                for (let j = i + 1; j < core.length; j++) {
                    const key = [core[i], core[j]].sort().join(" + ");
                    pairs[key] = (pairs[key] || 0) + 1;
                }
        });
        return Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 20);
    }, []);

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-12">
            <div className="flex gap-4 justify-center mb-8">
                <button
                    onClick={() => setFlavorView("frequency")}
                    className={`
            px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2
            ${flavorView === "frequency" ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}
          `}
                >
                    <BarChart3 size={16} /> Popularity
                </button>
                <button
                    onClick={() => setFlavorView("pairs")}
                    className={`
            px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2
            ${flavorView === "pairs" ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}
          `}
                >
                    <LinkIcon size={16} /> Top Combos
                </button>
            </div>

            <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                {flavorView === "frequency" && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                            <span className="text-blue-400"><BarChart3 size={24} /></span>
                            Most Popular Flavors
                        </h3>
                        <p className="text-sm text-gray-400 mb-8 font-medium">Click any flavor to see all drinks that use it</p>

                        <div className="flex flex-col gap-3">
                            {flavorFreq.map(([flavor, count]) => {
                                const c = FLAVOR_COLORS[flavor] || "#888";
                                return (
                                    <div
                                        key={flavor}
                                        onClick={() => goToExploreWithFlavors([flavor])}
                                        className="flex justify-start items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div className="w-24 sm:w-32 text-xs sm:text-sm font-bold text-right truncate" style={{ color: c }}>
                                            {flavor}
                                        </div>
                                        <div className="flex-1 h-8 bg-black/40 rounded-lg overflow-hidden border border-white/5 relative">
                                            <div
                                                className="h-full rounded-lg transition-all duration-1000 ease-out flex items-center px-3 min-w-[32px]"
                                                style={{
                                                    width: `${Math.max((count / maxFreq) * 100, 5)}%`,
                                                    background: `linear-gradient(90deg, ${c}66, ${c})`,
                                                }}
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-white drop-shadow-md z-10">{count}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {flavorView === "pairs" && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                            <span className="text-blue-400"><LinkIcon size={24} /></span>
                            Most Common Pairings
                        </h3>
                        <p className="text-sm text-gray-400 mb-8 font-medium">Click any combo to see drinks with both flavors</p>

                        <div className="flex flex-col gap-3">
                            {flavorPairs.map(([pair, count], i) => {
                                const [f1, f2] = pair.split(" + ");
                                return (
                                    <div
                                        key={pair}
                                        onClick={() => goToExploreWithFlavors([f1, f2])}
                                        className="flex items-center gap-3 cursor-pointer group p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all hover:shadow-lg"
                                    >
                                        <span className="w-6 sm:w-8 text-base sm:text-lg font-black text-gray-700 text-center opacity-50 group-hover:opacity-100 transition-opacity shrink-0">
                                            #{i + 1}
                                        </span>

                                        <div className="flex-1 flex flex-row items-center gap-1.5 sm:gap-2 md:gap-4 flex-nowrap min-w-0">
                                            {/* Flavor 1 */}
                                            <span
                                                className="px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold shrink border truncate max-w-[80px] sm:max-w-[120px]"
                                                style={{ backgroundColor: `${FLAVOR_COLORS[f1]}22`, color: FLAVOR_COLORS[f1], borderColor: `${FLAVOR_COLORS[f1]}44` }}
                                            >
                                                {f1}
                                            </span>

                                            <span className="text-gray-600 font-bold shrink-0 text-sm sm:text-base">+</span>

                                            {/* Flavor 2 */}
                                            <span
                                                className="px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold shrink border truncate max-w-[80px] sm:max-w-[120px]"
                                                style={{ backgroundColor: `${FLAVOR_COLORS[f2]}22`, color: FLAVOR_COLORS[f2], borderColor: `${FLAVOR_COLORS[f2]}44` }}
                                            >
                                                {f2}
                                            </span>

                                            {/* Count & Arrow */}
                                            <div className="ml-auto flex items-center gap-2 sm:gap-4 shrink-0 pl-1">
                                                <span className="text-[10px] sm:text-xs text-gray-400 font-bold bg-white/5 py-1 px-2 sm:px-3 rounded-full whitespace-nowrap">
                                                    {count} <span className="hidden sm:inline">drinks</span>
                                                </span>
                                                <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors hidden sm:block shrink-0" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
