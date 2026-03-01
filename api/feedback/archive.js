import supabase from "../_lib/db.js";
import { requireAdmin } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!requireAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { ids, status = "archived" } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids array is required" });
  }
  if (!["archived", "open"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const { error } = await supabase
    .from("feedback_submissions")
    .update({ status })
    .in("id", ids);

  if (error) {
    console.error("Supabase archive error:", error);
    return res.status(500).json({ error: "Failed to archive" });
  }

  return res.status(200).json({ success: true });
}
