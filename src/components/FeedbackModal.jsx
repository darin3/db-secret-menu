import React, { useState, useEffect, useRef } from "react";
import { X, Send, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { DRINKS } from "../data/drinks";

const TYPES = [
  { value: "drink_issue", label: "Drink Menu", icon: "🥤" },
  { value: "suggestion", label: "Suggestion", icon: "💡" },
  { value: "bug", label: "Bug / Other", icon: "🐛" },
];

const CATEGORIES_BY_TYPE = {
  drink_issue: ["Fix a Drink", "Add a Drink", "Other Details", "Discontinued"],
  suggestion: ["New Feature", "Quiz Feedback", "UI Improvement"],
  bug: ["Bug Report", "General Feedback"],
};

export default function FeedbackModal({ open, onClose }) {
  const [type, setType] = useState("drink_issue");
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");

  const [drinkName, setDrinkName] = useState("");
  const [drinkSuggestionsOpen, setDrinkSuggestionsOpen] = useState(false);
  const drinkDropdownRef = useRef(null);

  const [flavors, setFlavors] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    setType("drink_issue"); // Default to Drink Menu when opened
    const handleKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Click outside to close custom category dropdown
  useEffect(() => {
    if (!categoryOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen]);

  // Click outside to close drink suggestions
  useEffect(() => {
    if (!drinkSuggestionsOpen) return;
    const handleClickOutside = (e) => {
      if (drinkDropdownRef.current && !drinkDropdownRef.current.contains(e.target)) {
        setDrinkSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drinkSuggestionsOpen]);

  const resetForm = () => {
    setType("drink_issue");
    setCategory("");
    setCategoryOpen(false);
    setSummary("");
    setDetail("");
    setDrinkName("");
    setDrinkSuggestionsOpen(false);
    setFlavors("");
    setContactEmail("");
    setStatus("idle");
    setErrorMsg("");
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(resetForm, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !summary.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    // Serialize drink fields into detail text
    const showDrinkFields = type === "drink_issue";
    let fullDetail = "";
    if (showDrinkFields && (drinkName.trim() || flavors.trim())) {
      const parts = [];
      if (drinkName.trim()) parts.push(`Drink Name: ${drinkName.trim()}`);
      if (flavors.trim()) parts.push(`Flavors: ${flavors.trim()}`);
      fullDetail = parts.join("\n");
      if (detail.trim()) fullDetail += "\n\n" + detail.trim();
    } else {
      fullDetail = detail.trim();
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category: category || null,
          summary: summary.trim(),
          detail: fullDetail || null,
          contact_email: contactEmail.trim() || null,
          page_context: window.location.pathname,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl shadow-black/50 overflow-hidden flex flex-col max-h-full animate-fade-in-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0 bg-[#0a0a0a]">
          <h2 className="text-lg font-bold text-white tracking-tight">Send Feedback</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <X size={18} />
          </button>
        </div>

        {status === "success" ? (
          <div className="px-6 pb-8 text-center">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
            <p className="text-white font-semibold mb-1">Thanks for your feedback!</p>
            <p className="text-gray-400 text-sm mb-6">We'll review it soon.</p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 overflow-y-auto">
            {/* Type selector */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">What kind of feedback?</label>
              <div className="flex gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => { setType(t.value); setCategory(""); setCategoryOpen(false); setDrinkName(""); setFlavors(""); }}
                    className={`flex-1 py-3 px-2 rounded-xl text-[13px] sm:text-sm font-medium transition-all duration-200 border flex flex-col items-center justify-center gap-1.5 ${type === t.value
                      ? "bg-blue-500/10 border-blue-500/50 text-blue-400 bg-opacity-90 shadow-sm scale-[1.02]"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/10"
                      }`}
                  >
                    <span className="block text-xl sm:text-2xl mb-0.5">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category (contextual based on type) */}
            {type && CATEGORIES_BY_TYPE[type] && (
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <button
                  type="button"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full flex items-center justify-between bg-[#1a1a1a] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <span className={category ? "text-white" : "text-gray-500"}>
                    {category || "Select a category..."}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
                </button>

                {categoryOpen && (
                  <ul className="absolute z-10 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl shadow-black/50 max-h-60 overflow-y-auto divide-y divide-white/5">
                    {CATEGORIES_BY_TYPE[type].map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => {
                            setCategory(c);
                            setCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10 ${category === c ? "text-blue-400 bg-blue-500/10" : "text-gray-300"}`}
                        >
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Drink fields (contextual) */}
            {type === "drink_issue" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative" ref={drinkDropdownRef}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Which drink?</label>
                  <input
                    type="text"
                    value={drinkName}
                    onChange={(e) => {
                      setDrinkName(e.target.value);
                      if (e.target.value.trim()) setDrinkSuggestionsOpen(true);
                      else setDrinkSuggestionsOpen(false);
                    }}
                    onFocus={() => {
                      if (drinkName.trim()) setDrinkSuggestionsOpen(true);
                    }}
                    placeholder="e.g. Cosmic Brownie"
                    maxLength={100}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 transition-all duration-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                  {drinkSuggestionsOpen && drinkName.trim() && (
                    <ul className="absolute z-10 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl shadow-black/50 max-h-48 overflow-y-auto divide-y divide-white/5">
                      {DRINKS.filter(d => d.name.toLowerCase().includes(drinkName.toLowerCase())).slice(0, 10).map((drink) => (
                        <li key={drink.name}>
                          <button
                            type="button"
                            onClick={() => {
                              setDrinkName(drink.name);
                              setDrinkSuggestionsOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10 text-gray-300"
                          >
                            {drink.name}
                          </button>
                        </li>
                      ))}
                      {DRINKS.filter(d => d.name.toLowerCase().includes(drinkName.toLowerCase())).length === 0 && (
                        <li className="px-4 py-3 text-sm text-gray-500">
                          (New Drink Name)
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">What flavors?</label>
                  <input
                    type="text"
                    value={flavors}
                    onChange={(e) => setFlavors(e.target.value)}
                    placeholder="e.g. Chocolate, Caramel"
                    maxLength={200}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 transition-all duration-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Summary <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description of the issue or suggestion"
                maxLength={200}
                required
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 transition-all duration-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {type === "drink_issue" ? "Additional Notes" : "Details"}
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Any additional context, steps to reproduce, or specifics..."
                rows={3}
                maxLength={2000}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 transition-all duration-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Contact email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email <span className="text-gray-600 font-normal">(optional, for follow-up)</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 transition-all duration-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Error message */}
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="shrink-0" />
                <p>{errorMsg || "Something went wrong. Please try again."}</p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!type || !summary.trim() || status === "submitting"}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
              >
                {status === "submitting" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
