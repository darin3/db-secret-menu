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

  const { ids } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids array is required" });
  }

  const { error } = await supabase
    .from("feedback_submissions")
    .delete()
    .in("id", ids);

  if (error) {
    console.error("Supabase delete error:", error);
    return res.status(500).json({ error: "Failed to delete" });
  }

  return res.status(200).json({ success: true });
}
