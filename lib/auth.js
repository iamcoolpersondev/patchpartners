import crypto from "crypto";

const COOKIE = "patch_crm_session";

function secret() {
  return process.env.CRM_SESSION_SECRET || "";
}

export function createSessionValue() {
  const payload = Buffer.from(JSON.stringify({ v: 1, created: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return payload + "." + sig;
}

export function verifySessionValue(value) {
  if (!value || !secret()) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest();
  let actual;
  try { actual = Buffer.from(sig, "base64url"); } catch { return false; }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return Date.now() - data.created < 1000 * 60 * 60 * 24 * 7;
  } catch {
    return false;
  }
}

export const sessionCookie = COOKIE;
