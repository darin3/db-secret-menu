import React, { useMemo } from 'react';
import { F, T, getDrinkVibe, getDrinkBaseCategory, getDrinkAvail, VIBE_META, FLAVOR_COLORS } from '../data/drinks';
import {
    Palmtree,
    Cherry,
    Sparkles,
    Candy,
    Coffee,
    Info
} from 'lucide-react';

const ORDER_NAMES = { "Chocolate Mac": "Chocolate Macadamia Nut" };
const orderName = f => ORDER_NAMES[f] || f;

const VIBE_ICONS = {
    tropical: Palmtree,
    fruity: Cherry,
    fusion: Sparkles,
    indulgent: Coffee, // using Coffee as a stand-in for indulgent/chocolate
    sweet: Candy,
    cozy: Coffee,
};

export default function DrinkCard({ drink, open = false, onToggle }) {
    const vibe = getDrinkVibe(drink);
    const vm = VIBE_META[vibe] || VIBE_META.sweet;
    const Icon = VIBE_ICONS[vibe] || Candy;
    const avail = getDrinkAvail(drink);
    const displayFlavors = [...drink.flavors].sort();
    const displayToppings = [...(drink.toppings || [])].sort();

    const orderExample = useMemo(() => {
        const hasChai = drink.flavors.includes(F.CHAI) || (drink.toppings || []).includes(T.CHAI);
        const hasWhiteCoffee = (drink.toppings || []).includes(T.WHITE_COFFEE);

        // Build array of valid base types
        let baseTypes;
        if (hasChai) {
            baseTypes = ["chai"];
        } else if (hasWhiteCoffee) {
            baseTypes = ["white coffee latte", "white coffee freeze", "white coffee shake", "white coffee chai", "white coffee cold brew"];
        } else if (vibe === "fusion") {
            const hasAnyFruit = (drink.toppings || []).includes(T.ANY_FRUIT_FLAVOR);
            if (hasAnyFruit) {
                baseTypes = ["rebel", "soda", "shake"];
            } else {
                const baseCategory = getDrinkBaseCategory(drink);
                if (baseCategory === "rebel") {
                    baseTypes = ["rebel", "soda", "shake", "freeze"];
                } else {
                    baseTypes = ["latte", "freeze", "shake", "rebel", "soda"];
                }
            }
        } else if (["cozy", "indulgent", "sweet"].includes(vibe)) {
            baseTypes = ["latte", "freeze", "shake", "cold brew", "chai"];
        } else if (["tropical", "fruity"].includes(vibe)) {
            baseTypes = ["rebel", "iced lemonade", "soda", "iced tea"];
        } else {
            baseTypes = ["latte", "freeze", "chai"];
        }

        // Random selections
        const sizes = ["small", "medium", "large"];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const chosenBase = baseTypes[Math.floor(Math.random() * baseTypes.length)];

        // Temperature logic based on the core type (strip "white coffee " prefix)
        const coreType = chosenBase.replace("white coffee ", "");
        let temp = "";
        if (["latte", "chai"].includes(coreType)) {
            temp = Math.random() < 0.5 ? "iced" : "hot";
        }
        // freeze, shake, cold brew, rebel, soda → no temp

        // All available base types for "Try it as"
        const alts = baseTypes;

        return { size, chosenBase, temp, alts };
    }, []);

    return (
        <div
            onClick={onToggle}
            className={`
        bg-white/5 border rounded-2xl p-4 cursor-pointer transition-all duration-300
        hover:bg-white/10 flex flex-col h-full
        ${open ? 'border-opacity-50 ring-1' : 'border-white/10 ring-0'}
      `}
            style={{
                borderColor: open ? vm.color : '',
                '--tw-ring-color': vm.color
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-1 gap-3">
                <h3 className="text-lg font-bold text-gray-100 leading-tight flex-1 min-w-0 break-words">{drink.name}</h3>
                <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap bg-opacity-20 flex-shrink-0"
                    style={{ color: vm.color, backgroundColor: `${vm.color}33` }}
                >
                    <Icon size={14} />
                    <span>{vm.label}</span>
                </div>
            </div>

            {drink.aka && (
                <div className="text-xs text-gray-400 italic mb-2">
                    Previously: <span className="text-gray-300">{drink.aka}</span>
                </div>
            )}

            {/* Tags (Seasonal/Limited via getDrinkAvail) */}
            {avail && (
                <div className="flex flex-wrap gap-2 mb-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-gray-400 flex items-center gap-1">
                        <Info size={10} /> {avail === "seasonal" ? "Seasonal" : "Limited"} — check availability
                    </span>
                </div>
            )}

            {/* Flavor Chips — core flavors (solid), then toppings (dashed), each sorted */}
            <div className="flex flex-wrap items-start content-start gap-1.5 mt-2 flex-grow">
                {displayFlavors.map(f => {
                    const c = FLAVOR_COLORS[f] || "#888";
                    return (
                        <span
                            key={f}
                            className="px-2 py-0.5 rounded-lg text-[11px] font-semibold border"
                            style={{
                                backgroundColor: `${c}22`,
                                color: c,
                                borderColor: `${c}44`,
                            }}
                        >
                            {f}
                        </span>
                    );
                })}
                {displayToppings.map(f => (
                    <span
                        key={f}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-semibold border border-dashed text-gray-400 italic bg-white/5"
                        style={{ borderColor: '#444' }}
                    >
                        {f}
                    </span>
                ))}
            </div>

            {/* Expanded State: How to order */}
            <div
                className={`grid ${open ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="pt-3 border-t border-white/10">

                        {(() => {
                            const toppings = drink.toppings || [];
                            const floats = toppings.filter(f => f.includes("Float"));
                            const drizzles = toppings.filter(f => f.includes("Drizzle"));
                            const sprinks = toppings.filter(f => f.includes("Sprinks"));
                            const modifiers = [
                                floats.length > 0 && `${floats.join(" & ")} on top`,
                                drizzles.length > 0 && `${drizzles.join(" & ")}`,
                                sprinks.length > 0 && `${sprinks.join(" & ")}`,
                            ].filter(Boolean);
                            const { size, chosenBase, temp, alts } = orderExample;
                            const tempStr = temp ? `${temp} ` : "";
                            const altsFormatted = alts.length > 0
                                ? alts.map(a => a.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" "))
                                : [];
                            const altsText = altsFormatted.length > 1
                                ? altsFormatted.slice(0, -1).join(", ") + ", or " + altsFormatted[altsFormatted.length - 1]
                                : altsFormatted[0] || "";
                            return (
                                <>
                                    <div className="p-3 bg-white/5 rounded-xl text-xs text-gray-300 leading-relaxed">
                                        <strong className="text-white block mb-2">How to order:</strong>
                                        <p className="italic text-gray-200">
                                            "Can I get a {size} {tempStr}<span className="text-white font-semibold">{drink.name}</span> {chosenBase}
                                            {modifiers.length > 0 && <>, with {modifiers.join(" and ")}</>}?"
                                        </p>
                                        <p className="mt-2 text-gray-400">
                                            Flavors: <span className="text-gray-200">{displayFlavors.map(orderName).join(", ")}</span>
                                            {modifiers.length > 0 && <> + {modifiers.join(", ")}</>}
                                        </p>
                                    </div>
                                    {alts.length > 0 && (
                                        <div className="mt-2 text-[11px] text-gray-500 font-medium px-1">
                                            Recommended as: {altsText}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
