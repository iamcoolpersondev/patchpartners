import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionValue, sessionCookie } from "../../../../lib/auth";
import { listRequestIssues, updateRequestStatus } from "../../../../lib/github";

async function authorized() {
  const jar = await cookies();
  return verifySessionValue(jar.get(sessionCookie)?.value);
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ requests: await listRequestIssues() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { number, status } = await req.json();
    if (!Number.isInteger(number) || !["new","progress","done"].includes(status)) {
      return NextResponse.json({ error: "Invalid update" }, { status: 400 });
    }
    await updateRequestStatus(number, status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
