import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle, AlertCircle } from "lucide-react";

const TYPES = [
  { value: "drink_issue", label: "Menu Correction", icon: "🥤" },
  { value: "suggestion", label: "Suggestion", icon: "💡" },
  { value: "bug", label: "Bug / Other", icon: "🐛" },
];

const CATEGORIES_BY_TYPE = {
  drink_issue: ["Wrong Recipe/Info", "Wrong Name", "Drink Notes", "Discontinued Drink"],
  suggestion: ["Add a Drink", "New Feature", "Quiz Feedback", "UI Improvement"],
  bug: ["Bug Report", "General Feedback", "Praise"],
};

export default function FeedbackModal({ open, onClose }) {
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [drinkName, setDrinkName] = useState("");
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
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const resetForm = () => {
    setType("");
    setCategory("");
    setSummary("");
    setDetail("");
    setDrinkName("");
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
    const showDrinkFields = type === "drink_issue" || category === "Add a Drink";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-white">Send Feedback</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {/* Type selector */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">What kind of feedback?</label>
              <div className="flex gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => { setType(t.value); setCategory(""); setDrinkName(""); setFlavors(""); }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      type === t.value
                        ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="block text-base mb-0.5">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category (contextual based on type) */}
            {type && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES_BY_TYPE[type].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Drink fields (contextual) */}
            {(type === "drink_issue" || category === "Add a Drink") && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Which drink?</label>
                  <input
                    type="text"
                    value={drinkName}
                    onChange={(e) => setDrinkName(e.target.value)}
                    placeholder="e.g. Cosmic Brownie"
                    maxLength={100}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">What flavors? (comma-separated)</label>
                  <input
                    type="text"
                    value={flavors}
                    onChange={(e) => setFlavors(e.target.value)}
                    placeholder="e.g. Chocolate, Caramel"
                    maxLength={200}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </>
            )}

            {/* Summary */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Summary <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description of the issue or suggestion"
                maxLength={200}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {type === "drink_issue" || category === "Add a Drink" ? "Additional Notes" : "Details"}
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Any additional context, steps to reproduce, or specifics..."
                rows={3}
                maxLength={2000}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            {/* Contact email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email <span className="text-gray-600">(optional, for follow-up)</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Error message */}
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                <AlertCircle size={16} />
                {errorMsg || "Something went wrong. Please try again."}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!type || !summary.trim() || status === "submitting"}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
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
          </form>
        )}
      </div>
    </div>
  );
}
