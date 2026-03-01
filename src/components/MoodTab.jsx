import React, { useState } from 'react';
import { DRINKS, MOOD_QUESTIONS, getThirdQuestion } from '../data/drinks';
import DrinkCard from './DrinkCard';
import {
    Dices,
    Sparkles,
    RefreshCw,
    RotateCw,
    Palmtree,
    Cherry,
    Candy,
    Coffee,
    Coffee as CoffeeIcon,
    Droplets,
    Cookie,
    Wand2,
    HelpCircle,
    Leaf,
    Scale,
    Layers,
    Rainbow,
    ArrowRight,
    Zap,
    Minimize2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const OPTION_ICONS = {
    coffee: CoffeeIcon,
    zap: Zap,
    fruity: Cherry,
    chocolate: Cookie,
    caramel: Candy,
    combo: Wand2,
    mint: Leaf,
    leaf: Leaf,
    any: HelpCircle,
    simple: Minimize2,
    layers: Layers,
    berry: Droplets,
    coconut: Palmtree,
    refreshing: Droplets
};



export default function MoodTab() {
    const [moodStep, setMoodStep] = useState(0);
    const [moodAnswers, setMoodAnswers] = useState([]);
    const [moodResult, setMoodResult] = useState(null);
    const [filtersWidened, setFiltersWidened] = useState(false);
    const [resultPool, setResultPool] = useState(null);
    const [openCard, setOpenCard] = useState(null);

    const pickFromPool = (pool) => {
        const pickCount = Math.min(3, pool.length);
        const copy = [...pool];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, pickCount);
    };

    const handleGoBack = () => {
        if (moodResult) {
            setMoodResult(null);
            setResultPool(null);
            setFiltersWidened(false);
            // We want to return to question 3 (moodStep 2).
            // Currently moodStep is 2, but moodAnswers has 3 items. We slice to 2 items to match Step 2.
            setMoodAnswers(prev => prev.slice(0, 2));
        } else if (moodStep > 0) {
            setMoodStep(moodStep - 1);
            // If they were on Q2 (moodStep 1), they go to Q1 (moodStep 0). Slice answers to length 0.
            setMoodAnswers(prev => prev.slice(0, moodStep - 1));
        }
    };

    const handleMood = (opt) => {
        // Enforce that moodAnswers strictly matches the current moodStep to prevent any offset bugs
        const validAnswers = moodAnswers.slice(0, moodStep);
        const ans = [...validAnswers, opt];

        setMoodAnswers(ans);

        // We now have exactly 3 questions (2 constant, 1 dynamic)
        if (moodStep < 2) {
            setMoodStep(moodStep + 1);
            return;
        }

        let pool = [...DRINKS];
        let skipped = false;

        // Base filter (Question 1) is mandatory
        if (ans[0].filter) {
            pool = pool.filter(ans[0].filter);
        }

        // Try applying remaining filters progressively
        // If a filter reduces the pool to 0 (e.g., Rebel base + Chocolate flavor),
        // we skip that filter rather than returning no drinks.
        for (let i = 1; i < ans.length; i++) {
            if (ans[i].filter) {
                const narrowed = pool.filter(ans[i].filter);
                if (narrowed.length > 0) {
                    pool = narrowed;
                } else {
                    skipped = true;
                }
            }
        }

        setFiltersWidened(skipped);

        // Collect all scorers from user's answers
        const scorers = ans.map(a => a.scorer).filter(Boolean);

        // Build the selection pool: scored top half if scorers exist, otherwise full pool
        let selectionPool;
        if (scorers.length > 0 && pool.length > 3) {
            const scored = pool.map(d => ({
                drink: d,
                score: scorers.reduce((sum, fn) => sum + fn(d), 0),
            }));
            scored.sort((a, b) => b.score - a.score);
            const topN = Math.max(6, Math.ceil(scored.length / 2));
            selectionPool = scored.slice(0, Math.min(topN, scored.length)).map(s => s.drink);
        } else {
            selectionPool = pool;
        }

        setResultPool(selectionPool);
        setMoodResult(pickFromPool(selectionPool));
    };

    const shuffleResults = () => {
        if (resultPool) {
            setMoodResult(pickFromPool(resultPool));
        }
    };

    const resetMood = () => {
        setMoodStep(0);
        setMoodAnswers([]);
        setMoodResult(null);
        setFiltersWidened(false);
        setResultPool(null);
    };

    return (
        <div className="max-w-3xl mx-auto text-center animate-fade-in py-2 sm:py-4 px-3 sm:px-4">
            {!moodResult ? (
                <div className="bg-white/5 backdrop-blur-xl p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10">
                        {moodStep > 0 && (
                            <div className="flex items-center justify-center gap-2 mb-6 w-full">
                                <button
                                    onClick={handleGoBack}
                                    className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                                    aria-label="Go Back"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-1.5 text-xs flex-wrap justify-center border border-white/10 bg-black/20 rounded-full px-3 py-1.5">
                                    {moodAnswers.map((ans, i) => (
                                        <React.Fragment key={i}>
                                            <span className="text-blue-300 font-bold whitespace-nowrap">{ans.label}</span>
                                            {i < moodAnswers.length - 1 && <ChevronRight size={14} className="text-gray-500" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                        {moodStep === 0 && (
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 rotate-12 shadow-lg">
                                <Dices size={32} />
                            </div>
                        )}

                        <h2 className="text-2xl font-black mb-2 leading-tight">
                            {moodStep < 2 ? MOOD_QUESTIONS[moodStep].q : getThirdQuestion(moodAnswers).q}
                        </h2>

                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">
                            <span>Question {moodStep + 1}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <span>3</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-left">
                            {(moodStep < 2 ? MOOD_QUESTIONS[moodStep].options : getThirdQuestion(moodAnswers).options).map((opt, i) => {
                                const Icon = OPTION_ICONS[opt.icon] || HelpCircle;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleMood(opt)}
                                        className="w-full h-full px-4 sm:px-5 py-4 sm:py-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-50 transition-all duration-300 shadow-sm flex items-center justify-between group/btn relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-gray-400 group-hover/btn:text-blue-400 transition-colors shrink-0">
                                                <Icon size={18} className="sm:w-5 sm:h-5" />
                                            </div>
                                            <span className="text-sm sm:text-base font-bold leading-snug text-gray-200 group-hover/btn:text-white transition-colors">{opt.label}</span>
                                        </div>
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover/btn:bg-blue-500/20 group-hover/btn:text-blue-400 transition-colors shrink-0 ml-3 group-hover/btn:translate-x-1 duration-300">
                                            <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-8 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-sky-500 to-blue-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${((moodStep) / 3) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="flex items-center justify-center gap-2 mb-4 w-full mt-2">
                        <button
                            onClick={handleGoBack}
                            className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors bg-white/5"
                            aria-label="Go Back"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1.5 text-xs flex-wrap justify-center border border-white/10 bg-black/20 rounded-full px-3 py-1.5">
                            {moodAnswers.map((ans, i) => (
                                <React.Fragment key={i}>
                                    <span className="text-blue-300 font-bold whitespace-nowrap">{ans.label}</span>
                                    {i < moodAnswers.length - 1 && <ChevronRight size={14} className="text-gray-500" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-3xl font-black mb-8 mt-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {moodResult.length > 0 ? "Here are your picks!" : "No exact matches found"}
                    </h2>



                    {moodResult.length > 0 ? (
                        <div className="min-h-[380px]">
                            {filtersWidened && (
                                <p className="text-gray-400 text-sm mb-4">We widened your results to find more matches.</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24 sm:pb-0">
                                {moodResult.map((d) => (
                                    <div key={d.name} className="text-left">
                                        <DrinkCard drink={d} open={openCard === d.name} onToggle={() => setOpenCard(prev => prev === d.name ? null : d.name)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="min-h-[380px]">
                            <p className="text-gray-400 text-sm mb-4">
                                We couldn't find drinks matching all your preferences. Try again with different choices!
                            </p>
                        </div>
                    )}

                    <div className="fixed sm:relative mx-auto bottom-6 sm:bottom-auto left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 z-50 sm:z-auto flex flex-row items-center justify-center gap-2 sm:gap-3 bg-gray-900/95 sm:bg-transparent px-2.5 sm:px-0 py-2 sm:py-0 rounded-full sm:rounded-none border border-white/10 sm:border-none shadow-2xl sm:shadow-none backdrop-blur-xl sm:backdrop-blur-none mb-0 sm:mb-8 w-max">
                        <button
                            onClick={resetMood}
                            className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full font-bold flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 text-white hover:bg-white/20 transition-colors text-sm sm:text-base shadow-lg sm:shadow-none whitespace-nowrap"
                        >
                            <RefreshCw size={18} className="sm:w-[18px] sm:h-[18px] w-4 h-4" /> Start Over
                        </button>
                        {resultPool && resultPool.length > 3 && (
                            <button
                                onClick={shuffleResults}
                                className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full font-bold flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 hover:text-blue-300 transition-colors text-sm sm:text-base shadow-lg sm:shadow-none whitespace-nowrap"
                            >
                                <RotateCw size={18} className="sm:w-[18px] sm:h-[18px] w-4 h-4" /> Shuffle
                            </button>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
