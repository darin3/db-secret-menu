import supabase from "./_lib/db.js";
import { requireAdmin } from "./_lib/auth.js";
import { sendFeedbackEmail } from "./_lib/email.js";

const VALID_TYPES = ["drink_issue", "suggestion", "bug", "other"];

export default async function handler(req, res) {
  if (req.method === "POST") {
    return handlePost(req, res);
  }
  if (req.method === "GET") {
    return handleGet(req, res);
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}

async function handlePost(req, res) {
  const { type, category, summary, detail, contact_email, page_context } =
    req.body || {};

  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: "Invalid type" });
  }
  if (!summary || typeof summary !== "string" || summary.trim().length === 0) {
    return res.status(400).json({ error: "Summary is required" });
  }

  const row = {
    type,
    category: category || null,
    summary: summary.trim(),
    detail: detail ? detail.trim() : null,
    contact_email: contact_email ? contact_email.trim() : null,
    page_context: page_context || null,
    user_agent: req.headers["user-agent"] || null,
  };

  const { data, error } = await supabase
    .from("feedback_submissions")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Failed to save feedback" });
  }

  // Fire-and-forget email
  sendFeedbackEmail({ ...row, id: data.id }).catch((err) =>
    console.error("Email send error:", err)
  );

  return res.status(201).json({ success: true, id: data.id });
}

async function handleGet(req, res) {
  if (!requireAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const status = req.query.status || "open";

  const { data, error } = await supabase
    .from("feedback_submissions")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase query error:", error);
    return res.status(500).json({ error: "Failed to fetch feedback" });
  }

  // Get counts for both statuses
  const { count: openCount } = await supabase
    .from("feedback_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  const { count: archivedCount } = await supabase
    .from("feedback_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "archived");

  return res.status(200).json({
    submissions: data,
    counts: { open: openCount || 0, archived: archivedCount || 0 },
  });
}
