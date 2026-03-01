import nodemailer from "nodemailer";

const TYPE_COLORS = {
  drink_issue: { bg: "#e74c3c", label: "Drink Menu" },
  suggestion: { bg: "#3498db", label: "Suggestion" },
  bug: { bg: "#e67e22", label: "Bug / Other" },
  other: { bg: "#95a5a6", label: "Other" },
};

const TYPE_ICONS = {
  drink_issue: "\u{1F964}",
  suggestion: "\u{1F4A1}",
  bug: "\u{1F41B}",
  other: "\u{1F4AC}",
};

export async function sendFeedbackEmail(submission) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const type = TYPE_COLORS[submission.type] || TYPE_COLORS.other;
  const icon = TYPE_ICONS[submission.type] || "";
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Build metadata rows — only include fields that have meaningful values
  const metaRows = [];
  if (submission.contact_email) {
    metaRows.push(`<tr><td style="padding: 6px 12px 6px 0; color: #888; white-space: nowrap;">Email</td><td style="padding: 6px 0;"><a href="mailto:${submission.contact_email}" style="color: #60a5fa; text-decoration: none;">${submission.contact_email}</a></td></tr>`);
  }
  if (submission.page_context && submission.page_context !== "/") {
    metaRows.push(`<tr><td style="padding: 6px 12px 6px 0; color: #888; white-space: nowrap;">Page</td><td style="padding: 6px 0; color: #ccc;">${submission.page_context}</td></tr>`);
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #111; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
      <div style="background: linear-gradient(135deg, #0a0a0a, #151520); padding: 28px 28px 20px;">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px;">&#10084;&#65039; DB Secret Menu</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
          <span style="display: inline-block; background: ${type.bg}; color: #fff; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.3px;">${icon} ${type.label}</span>
          ${submission.category ? `<span style="display: inline-block; background: rgba(255,255,255,0.08); color: #aaa; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">${submission.category}</span>` : ""}
        </div>
        <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #fff; line-height: 1.4;">${submission.summary}</h2>
      </div>

      <div style="padding: 0 28px 28px;">
        ${submission.detail ? `
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 18px; margin-top: 20px; white-space: pre-wrap; font-size: 14px; line-height: 1.7; color: #ddd;">${submission.detail}</div>
        ` : ""}

        ${metaRows.length > 0 ? `
          <table style="width: 100%; font-size: 13px; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
            ${metaRows.join("")}
          </table>
        ` : ""}

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #555;">
          ${timestamp} PT &middot; ID #${submission.id}
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.FEEDBACK_RECIPIENT,
    subject: `[DB Secret Menu] ${type.label}${submission.category ? ` — ${submission.category}` : ""}: ${submission.summary}`,
    html,
  });
}
