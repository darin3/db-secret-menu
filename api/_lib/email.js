import nodemailer from "nodemailer";

const TYPE_COLORS = {
  drink_issue: { bg: "#e74c3c", label: "Menu Correction" },
  suggestion: { bg: "#3498db", label: "Suggestion" },
  bug: { bg: "#e67e22", label: "Bug / Other" },
  other: { bg: "#95a5a6", label: "Other" },
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

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h1 style="margin: 0; font-size: 20px; color: #fff;">DB Secret Menu Feedback</h1>
      </div>
      <div style="padding: 24px;">
        <div style="margin-bottom: 16px;">
          <span style="display: inline-block; background: ${type.bg}; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${type.label}</span>
          ${submission.category ? `<span style="display: inline-block; background: rgba(255,255,255,0.1); color: #ccc; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin-left: 8px;">${submission.category}</span>` : ""}
        </div>
        <h2 style="margin: 0 0 16px; font-size: 18px; color: #fff;">${submission.summary}</h2>
        ${submission.detail ? `<div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; margin-bottom: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${submission.detail}</div>` : ""}
        <table style="width: 100%; font-size: 13px; color: #999;">
          ${submission.contact_email ? `<tr><td style="padding: 4px 0;">Contact</td><td style="padding: 4px 0;"><a href="mailto:${submission.contact_email}" style="color: #3498db;">${submission.contact_email}</a></td></tr>` : ""}
          ${submission.page_context ? `<tr><td style="padding: 4px 0;">Page</td><td style="padding: 4px 0;">${submission.page_context}</td></tr>` : ""}
        </table>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.FEEDBACK_RECIPIENT,
    subject: `[DB Secret Menu] ${type.label} - ${submission.summary}`,
    html,
  });
}
