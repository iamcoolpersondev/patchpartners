"use client";

import { useEffect, useState } from "react";

function statusOf(title) {
  if (title.startsWith("[DONE]")) return "done";
  if (title.startsWith("[IN PROGRESS]")) return "progress";
  return "new";
}

function getField(body, field) {
  const match = body.match(new RegExp("\\*\\*" + field + ":\\*\\*\\s*(.+)"));
  return match?.[1]?.trim() || "—";
}

function getDetails(body) {
  const marker = "### Details";
  const start = body.indexOf(marker);
  if (start < 0) return body;
  return body.slice(start + marker.length).split("\n---")[0].trim();
}

export default function CRM() {
  const [authed, setAuthed] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/crm/requests", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not load requests.");
      setAuthed(true);
      return;
    }
    setRequests(data.requests || []);
    setAuthed(true);
    setError("");
  }

  useEffect(() => { load(); }, []);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Could not sign in.");
    setPassword("");
    await load();
  }

  async function update(number, status) {
    setError("");
    const res = await fetch("/api/crm/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, status }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not update request.");
    await load();
  }

  async function logout() {
    await fetch("/api/crm/logout", { method: "POST" });
    setAuthed(false);
    setRequests([]);
  }

  if (authed === null) {
    return <main className="crmCenter"><div className="crmLoader">Loading Patch Partners CRM…</div></main>;
  }

  if (!authed) {
    return (
      <main className="crmCenter">
        <form className="crmLogin" onSubmit={login}>
          <a className="brand" href="/"><span className="brandMark">P</span><span>Patch Partners</span></a>
          <p className="kicker">OWNER CRM</p>
          <h1>Welcome back.</h1>
          <p>Sign in to view customer requests and update their status.</p>
          <label>PASSWORD<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus /></label>
          <button className="button" disabled={loading}>{loading ? "Signing in…" : "Sign in →"}</button>
          {error && <p className="crmError">{error}</p>}
          <a className="crmBack" href="/">← Back to website</a>
        </form>
      </main>
    );
  }

  const counts = {
    new: requests.filter((r) => statusOf(r.title) === "new").length,
    progress: requests.filter((r) => statusOf(r.title) === "progress").length,
    done: requests.filter((r) => statusOf(r.title) === "done").length,
  };

  return (
    <main className="crmPage">
      <header className="crmHeader">
        <a className="brand" href="/"><span className="brandMark">P</span><span>Patch Partners</span></a>
        <div><span className="crmOwner">Owner CRM</span><button className="crmLogout" onClick={logout}>Sign out</button></div>
      </header>

      <section className="crmShell">
        <div className="crmTitleRow">
          <div><p className="kicker">REQUESTS</p><h1>Customer work</h1><p>Everything customers have sent through the website.</p></div>
          <button className="crmRefresh" onClick={load}>↻ Refresh</button>
        </div>

        <div className="crmStats">
          <div><span>New</span><strong>{counts.new}</strong></div>
          <div><span>In progress</span><strong>{counts.progress}</strong></div>
          <div><span>Done</span><strong>{counts.done}</strong></div>
          <div><span>Total</span><strong>{requests.length}</strong></div>
        </div>

        {error && <div className="crmBanner">{error}</div>}

        <div className="crmList">
          {requests.length === 0 ? (
            <div className="crmEmpty"><span>✦</span><h3>No requests yet</h3><p>New customer requests will appear here automatically.</p></div>
          ) : requests.map((r) => {
            const status = statusOf(r.title);
            return (
              <article className="crmCard" key={r.number}>
                <div className="crmCardTop">
                  <div>
                    <span className={"crmStatus " + status}>{status === "progress" ? "In progress" : status}</span>
                    <span className="crmNumber">#{r.number}</span>
                  </div>
                  <time>{new Date(r.createdAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}</time>
                </div>
                <h2>{r.title.replace(/^\[(NEW|IN PROGRESS|DONE)\]\s*/i, "")}</h2>
                <div className="crmMeta">
                  <span><b>Name</b>{getField(r.body, "Name")}</span>
                  <span><b>Email</b>{getField(r.body, "Email")}</span>
                  <span><b>Urgency</b>{getField(r.body, "Urgency")}</span>
                  <span><b>Link</b>{getField(r.body, "Project link")}</span>
                </div>
                <div className="crmDetails"><b>Request details</b><p>{getDetails(r.body)}</p></div>
                <div className="crmActions">
                  <label>STATUS
                    <select value={status} onChange={(e) => update(r.number, e.target.value)}>
                      <option value="new">New</option>
                      <option value="progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                  </label>
                  <a href={r.url} target="_blank" rel="noreferrer">Open in GitHub ↗</a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
