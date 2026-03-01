import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Lock, Inbox, Archive, Trash2, CheckSquare, Square,
  AlertCircle, Lightbulb, Bug, HelpCircle, RefreshCw, LogOut,
} from "lucide-react";

const PAGE_NAMES = { "/": "Explore", "/discover": "Pick My Drink", "/map": "Flavor Map" };

const TYPE_META = {
  drink_issue: { label: "Drink Menu", icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
  suggestion: { label: "Suggestion", icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-400/10" },
  bug: { label: "Bug / Other", icon: Bug, color: "text-orange-400", bg: "bg-orange-400/10" },
  other: { label: "Other", icon: HelpCircle, color: "text-gray-400", bg: "bg-gray-400/10" },
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function FeedbackAdmin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [tab, setTab] = useState("open");
  const [typeFilter, setTypeFilter] = useState(null);
  // Cache both tabs in a single object
  const [allData, setAllData] = useState({ open: [], archived: [] });
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${password}`,
  }), [password]);

  // Fetch both tabs at once
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [openRes, archivedRes] = await Promise.all([
        fetch("/api/feedback?status=open", { headers: authHeaders() }),
        fetch("/api/feedback?status=archived", { headers: authHeaders() }),
      ]);
      if (openRes.status === 401 || archivedRes.status === 401) {
        setAuthed(false);
        sessionStorage.removeItem("admin_pw");
        return;
      }
      if (!openRes.ok || !archivedRes.ok) throw new Error("Failed to fetch");
      const [openData, archivedData] = await Promise.all([openRes.json(), archivedRes.json()]);
      setAllData({ open: openData.submissions, archived: archivedData.submissions });
      setSelected(new Set());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  // Try stored password on mount
  useEffect(() => {
    if (password) {
      fetch("/api/feedback?status=open", { headers: { Authorization: `Bearer ${password}` } })
        .then((r) => { if (r.ok) setAuthed(true); else sessionStorage.removeItem("admin_pw"); });
    }
  }, []);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const pw = pwInput.trim();
    if (!pw) return;
    const res = await fetch("/api/feedback?status=open", {
      headers: { Authorization: `Bearer ${pw}` },
    });
    if (res.ok) {
      setPassword(pw);
      sessionStorage.setItem("admin_pw", pw);
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  // Optimistic archive: move items from open → archived locally
  const optimisticArchive = (ids) => {
    setAllData(prev => {
      const idSet = new Set(ids);
      const moving = prev.open.filter(s => idSet.has(s.id));
      return {
        open: prev.open.filter(s => !idSet.has(s.id)),
        archived: [...moving.map(s => ({ ...s, status: "archived" })), ...prev.archived],
      };
    });
    setSelected(new Set());
  };

  // Optimistic unarchive: move items from archived → open locally
  const optimisticUnarchive = (ids) => {
    setAllData(prev => {
      const idSet = new Set(ids);
      const moving = prev.archived.filter(s => idSet.has(s.id));
      return {
        open: [...moving.map(s => ({ ...s, status: "open" })), ...prev.open],
        archived: prev.archived.filter(s => !idSet.has(s.id)),
      };
    });
    setSelected(new Set());
  };

  // Optimistic delete: remove items from current tab
  const optimisticDelete = (ids) => {
    const idSet = new Set(ids);
    setAllData(prev => ({
      open: prev.open.filter(s => !idSet.has(s.id)),
      archived: prev.archived.filter(s => !idSet.has(s.id)),
    }));
    setSelected(new Set());
  };

  const bulkAction = async (action) => {
    if (selected.size === 0) return;
    const ids = [...selected];
    if (action === "archive") {
      optimisticArchive(ids);
      fetch("/api/feedback/archive", { method: "POST", headers: authHeaders(), body: JSON.stringify({ ids }) })
        .catch(() => fetchAll());
    } else if (action === "unarchive") {
      optimisticUnarchive(ids);
      fetch("/api/feedback/archive", { method: "POST", headers: authHeaders(), body: JSON.stringify({ ids, status: "open" }) })
        .catch(() => fetchAll());
    } else {
      optimisticDelete(ids);
      fetch("/api/feedback/delete", { method: "POST", headers: authHeaders(), body: JSON.stringify({ ids }) })
        .catch(() => fetchAll());
    }
  };

  const singleAction = async (id, action) => {
    if (action === "archive") {
      optimisticArchive([id]);
      fetch("/api/feedback/archive", { method: "POST", headers: authHeaders(), body: JSON.stringify({ ids: [id] }) })
        .catch(() => fetchAll());
    } else if (action === "unarchive") {
      optimisticUnarchive([id]);
      fetch("/api/feedback/archive", { method: "POST", headers: authHeaders(), body: JSON.stringify({ ids: [id], status: "open" }) })
        .catch(() => fetchAll());
    } else if (action === "delete") {
      optimisticDelete([id]);
      fetch(`/api/feedback/${id}`, { method: "DELETE", headers: authHeaders() })
        .catch(() => fetchAll());
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submissions = allData[tab] || [];
  const filtered = typeFilter
    ? submissions.filter((s) => s.type === typeFilter)
    : submissions;

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((s) => s.id)));
    }
  };

  // Stats for current tab
  const stats = {
    total: submissions.length,
    drink_issue: submissions.filter((s) => s.type === "drink_issue").length,
    suggestion: submissions.filter((s) => s.type === "suggestion").length,
    bug: submissions.filter((s) => s.type === "bug").length,
  };

  const counts = { open: allData.open.length, archived: allData.archived.length };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <Lock size={32} className="mx-auto mb-4 text-gray-400" />
            <h1 className="text-xl font-bold mb-1">Admin Access</h1>
            <p className="text-gray-500 text-sm mb-6">Enter the admin password to continue.</p>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 mb-3"
            />
            {pwError && (
              <p className="text-red-400 text-sm mb-3">Incorrect password.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-sky-500 text-white"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Feedback Admin</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchAll}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => { setAuthed(false); setPassword(""); sessionStorage.removeItem("admin_pw"); }}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Menu", value: stats.drink_issue, color: "text-red-400" },
            { label: "Suggestions", value: stats.suggestion, color: "text-blue-400" },
            { label: "Bug Reports", value: stats.bug, color: "text-orange-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => { setTab("open"); setTypeFilter(null); setSelected(new Set()); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "open"
                ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Inbox size={16} />
            Inbox ({counts.open})
          </button>
          <button
            onClick={() => { setTab("archived"); setTypeFilter(null); setSelected(new Set()); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "archived"
                ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Archive size={16} />
            Archive ({counts.archived})
          </button>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["drink_issue", "suggestion", "bug", "other"].map((t) => {
            const meta = TYPE_META[t];
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  typeFilter === t
                    ? `${meta.bg} ${meta.color} border-current`
                    : "bg-white/5 text-gray-500 border-white/10 hover:text-gray-300"
                }`}
              >
                <meta.icon size={13} />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-400">{selected.size} selected</span>
            <div className="flex gap-2 ml-auto">
              {tab === "open" && (
                <button
                  onClick={() => bulkAction("archive")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                >
                  <Archive size={13} /> Archive
                </button>
              )}
              {tab === "archived" && (
                <button
                  onClick={() => bulkAction("unarchive")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                >
                  <Inbox size={13} /> Unarchive
                </button>
              )}
              <button
                onClick={() => bulkAction("delete")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Submissions list */}
        {loading && submissions.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <RefreshCw size={24} className="mx-auto mb-3 animate-spin" />
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Inbox size={32} className="mx-auto mb-3 opacity-50" />
            <p>{typeFilter ? "No submissions of this type." : "No submissions yet."}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Select all */}
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 px-1 py-1 transition-colors"
            >
              {selected.size === filtered.length ? <CheckSquare size={14} /> : <Square size={14} />}
              {selected.size === filtered.length ? "Deselect all" : "Select all"}
            </button>

            {filtered.map((s) => {
              const meta = TYPE_META[s.type] || TYPE_META.other;
              const Icon = meta.icon;
              return (
                <div
                  key={s.id}
                  className={`bg-white/5 border rounded-xl p-4 transition-all ${
                    selected.has(s.id) ? "border-blue-500/50 bg-blue-500/5" : "border-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(s.id)}
                      className="mt-0.5 text-gray-500 hover:text-white transition-colors"
                    >
                      {selected.has(s.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                          <Icon size={11} /> {meta.label}
                        </span>
                        {s.category && (
                          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {s.category}
                          </span>
                        )}
                        <span className="text-xs text-gray-600 ml-auto whitespace-nowrap">
                          {formatDate(s.created_at)}
                        </span>
                      </div>

                      {/* Summary */}
                      <p className="text-sm text-white font-medium mb-1">{s.summary}</p>

                      {/* Detail */}
                      {s.detail && (
                        <p className="text-xs text-gray-400 whitespace-pre-wrap line-clamp-3 mb-2">
                          {s.detail}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        {s.contact_email && <span>📧 {s.contact_email}</span>}
                        {s.page_context && <span>📄 {PAGE_NAMES[s.page_context] || s.page_context}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 shrink-0">
                      {tab === "open" && (
                        <button
                          onClick={() => singleAction(s.id, "archive")}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                          title="Archive"
                        >
                          <Archive size={14} />
                        </button>
                      )}
                      {tab === "archived" && (
                        <button
                          onClick={() => singleAction(s.id, "unarchive")}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-400/10 transition-colors"
                          title="Unarchive"
                        >
                          <Inbox size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => singleAction(s.id, "delete")}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
