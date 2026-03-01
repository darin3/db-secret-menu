import React, { useState, useMemo, useEffect } from 'react';
import { DRINKS, ACTIVE_VIBES, VIBE_META, ALL_CORE_FLAVORS, FLAVOR_COLORS, getDrinkVibe, getDrinkBaseCategory, allFlavors } from '../data/drinks';
import FilterChip from './FilterChip';
import DrinkCard from './DrinkCard';
import {
    Search,
    X,
    Filter,
    ChevronDown,
    ChevronUp,
    Palmtree,
    Cherry,
    Sparkles,
    Candy,
    Coffee,
    Coffee as CoffeeIcon,
    Clipboard,
    Check
} from 'lucide-react';

const VIBE_ICONS = {
    tropical: Palmtree,
    fruity: Cherry,
    fusion: Sparkles,
    indulgent: CoffeeIcon,
    sweet: Candy,
    cozy: Coffee,
};
export default function ExploreTab({ initialFlavors, onInitialFlavorsConsumed, resetKey }) {
    const [search, setSearch] = useState("");
    const [selBase, setSelBase] = useState(null); // 'coffee' or 'rebel'
    const [selVibes, setSelVibes] = useState([]);
    const [selFlavors, setSelFlavors] = useState([]);
    const [copied, setCopied] = useState(false);
    const [openCard, setOpenCard] = useState(null);

    const clearFilters = () => { setSearch(""); setSelBase(null); setSelVibes([]); setSelFlavors([]); setOpenCard(null); };

    useEffect(() => {
        if (initialFlavors && initialFlavors.length > 0) {
            setSelFlavors(initialFlavors);
            if (onInitialFlavorsConsumed) onInitialFlavorsConsumed();
        }
    }, [initialFlavors]);

    useEffect(() => {
        if (resetKey > 0) {
            clearFilters();
        }
    }, [resetKey]);

    const toggle = (arr, setArr, val) => setArr(p => p.includes(val) ? p.filter(v => v !== val) : [...p, val]);

    const filtered = useMemo(() => {
        return DRINKS.filter(d => {
            if (search) {
                const s = search.toLowerCase();
                if (!d.name.toLowerCase().includes(s) && !d.aka?.toLowerCase().includes(s) && !allFlavors(d).some(f => f.toLowerCase().includes(s))) return false;
            }
            if (selBase) {
                if (getDrinkBaseCategory(d) !== selBase) return false;
            }
            if (selVibes.length) {
                const vibe = getDrinkVibe(d);
                if (!selVibes.includes(vibe)) return false;
            }
            if (selFlavors.length && !selFlavors.every(f => d.flavors.some(df => df === f))) return false;
            return true;
        });
    }, [search, selBase, selVibes, selFlavors]);
    const hasFilters = search.length > 0 || selBase !== null || selVibes.length > 0 || selFlavors.length > 0;

    const copyFilteredDrinks = () => {
        if (!filtered.length) return;
        const textToCopy = [...filtered]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(d => `${d.name}: ${allFlavors(d).join(', ')}`)
            .join('\n');

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in">
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search drinks, old names, or flavors..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-white/5 border-2 border-gray-800 rounded-full text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 shadow-inner"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Filter Section */}
            <div className="bg-white/5 p-4 rounded-3xl mb-6 shadow-xl border border-white/5">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <CoffeeIcon size={14} /> Base Drink
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <FilterChip
                            active={selBase === 'coffee'}
                            inactive={selBase !== null && selBase !== 'coffee'}
                            color="#A67C52"
                            onClick={() => setSelBase(selBase === 'coffee' ? null : 'coffee')}
                            label="Latte / Chai / Cocoa"
                            icon={CoffeeIcon}
                        />
                        <FilterChip
                            active={selBase === 'rebel'}
                            inactive={selBase !== null && selBase !== 'rebel'}
                            color="#C084FC"
                            onClick={() => setSelBase(selBase === 'rebel' ? null : 'rebel')}
                            label="Rebel / Lemonade / Tea / Soda"
                            icon={Palmtree}
                        />
                    </div>
                </div>

                <div className="mb-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <Filter size={14} /> Vibes
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {ACTIVE_VIBES.map(v => (
                            <FilterChip
                                key={v}
                                active={selVibes.includes(v)}
                                inactive={selVibes.length > 0 && !selVibes.includes(v)}
                                color={VIBE_META[v].color}
                                onClick={() => toggle(selVibes, setSelVibes, v)}
                                label={VIBE_META[v].label}
                                icon={VIBE_ICONS[v]}
                            />
                        ))}
                    </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        <Filter size={14} /> Flavors
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {ALL_CORE_FLAVORS.map(f => (
                            <FilterChip
                                key={f}
                                active={selFlavors.includes(f)}
                                inactive={selFlavors.length > 0 && !selFlavors.includes(f)}
                                color={FLAVOR_COLORS[f] || "#888"}
                                onClick={() => toggle(selFlavors, setSelFlavors, f)}
                                label={f}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Meta */}
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-gray-400 text-sm font-medium">Showing {filtered.length} of {DRINKS.length} drinks</span>
                <div className="flex items-center gap-2">
                    {filtered.length > 0 && (
                        <button
                            onClick={copyFilteredDrinks}
                            className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'}`}
                            aria-label="Copy drink list"
                        >
                            {copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? 'Copied List!' : 'Copy List'}
                        </button>
                    )}
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full transition-colors"
                        >
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 sm:gap-4 justify-center mt-2">
                {filtered.map(d => (
                    <DrinkCard key={d.name} drink={d} open={openCard === d.name} onToggle={() => setOpenCard(prev => prev === d.name ? null : d.name)} />
                ))}
            </div>

            {/* Empty State */}
            {!filtered.length && (
                <div className="text-center py-16 bg-white/5 rounded-3xl mt-4 border border-dashed border-white/10">
                    <div className="text-5xl mb-4 opacity-50">🫗</div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No drinks match these filters</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">Try removing some vibes or flavors to see more results.</p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full font-bold shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all text-sm"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
