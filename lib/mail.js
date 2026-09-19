import nodemailer from "nodemailer";

function configured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE || "true") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendRequestEmails(data, issueNumber) {
  if (!configured()) return { skipped: true };

  const tx = transporter();
  const owner = process.env.REQUEST_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const safe = (v) => String(v || "").replace(/[<>&]/g, (c) => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;" }[c]));

  await Promise.all([
    tx.sendMail({
      from: process.env.SMTP_FROM,
      to: owner,
      subject: `New Patch Partners request #${issueNumber}: ${data.type}`,
      text: `${data.name} (${data.email}) submitted a ${data.type} request.\n\nUrgency: ${data.urgency}\nLink: ${data.link || "N/A"}\n\n${data.details}`,
    }),
    tx.sendMail({
      from: process.env.SMTP_FROM,
      to: data.email,
      subject: "We received your Patch Partners request",
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1b1d19"><h2>Thanks, ${safe(data.name)}.</h2><p>We received your request and our team will review it.</p><div style="background:#f5f5f0;border-radius:14px;padding:18px;margin:22px 0"><strong>Request #${issueNumber}</strong><br><span style="color:#666">${safe(data.type)} · ${safe(data.urgency)}</span></div><p>You do not need to send the same request again. We’ll contact you using this email address if we need more details.</p><p style="color:#888;margin-top:32px">— Patch Partners</p></div>`,
    }),
  ]);

  return { skipped: false };
}
