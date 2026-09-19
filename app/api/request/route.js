import { NextResponse } from "next/server";
import { createRequestIssue } from "../../../lib/github";
import { sendRequestEmails } from "../../../lib/mail";

function clean(value, max = 1000) {
  return String(value || "").trim().slice(0, max);
}

export async function POST(req) {
  try {
    const raw = await req.json();
    const data = {
      name: clean(raw.name, 100),
      email: clean(raw.email, 180),
      type: clean(raw.type, 100),
      link: clean(raw.link, 500),
      details: clean(raw.details, 6000),
      urgency: clean(raw.urgency, 50),
    };

    if (!data.name || !data.email || !data.details || !data.email.includes("@")) {
      return NextResponse.json({ error: "Please fill in your name, email and request details." }, { status: 400 });
    }

    const issue = await createRequestIssue(data);
    await sendRequestEmails(data, issue.number).catch((error) => {
      console.error("Email notification failed:", error);
    });

    return NextResponse.json({
      ok: true,
      requestId: issue.number,
      message: `Request #${issue.number} sent. Thanks — we’ll review it soon.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "We couldn’t send your request right now. Please try again shortly." }, { status: 500 });
  }
}
