import { NextResponse } from "next/server";
import { createSessionValue, sessionCookie } from "../../../../lib/auth";
import crypto from "crypto";

export async function POST(req) {
  const { password = "" } = await req.json();
  const expected = process.env.CRM_PASSWORD || "";
  if (!expected || !process.env.CRM_SESSION_SECRET) {
    return NextResponse.json({ error: "CRM authentication is not configured." }, { status: 503 });
  }

  const a = Buffer.from(String(password));
  const b = Buffer.from(expected);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!valid) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
