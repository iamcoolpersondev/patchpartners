"use client";

import { useState } from "react";

export default function RequestForm() {
  const [state, setState] = useState({ status: "idle", message: "" });

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", message: "" });
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState({ status: "success", message: data.message || "Request sent." });
      e.currentTarget.reset();
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  }

  return (
    <form className="requestForm" onSubmit={submit}>
      <div className="formRow">
        <label>YOUR NAME<input name="name" required placeholder="Alex Smith" maxLength={100} /></label>
        <label>EMAIL<input name="email" type="email" required placeholder="alex@example.com" maxLength={180} /></label>
      </div>
      <label>WHAT DO YOU NEED?
        <select name="type" defaultValue="Fix something">
          <option>Fix something</option>
          <option>Build something</option>
          <option>Improve / redesign something</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label>PROJECT / WEBSITE LINK <span className="optional">(optional)</span>
        <input name="link" type="url" placeholder="https://..." maxLength={500} />
      </label>
      <label>TELL US ABOUT IT
        <textarea name="details" required rows={7} placeholder="What should be fixed or made? What is happening now, and what would you like instead?" maxLength={6000} />
      </label>
      <label>HOW URGENT IS IT?
        <select name="urgency" defaultValue="Normal">
          <option>Normal</option>
          <option>Soon</option>
          <option>Urgent</option>
        </select>
      </label>
      <button className="button submitButton" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Sending…" : <>Send request <span>→</span></>}
      </button>
      <p className={"formMessage " + state.status} aria-live="polite">{state.message}</p>
    </form>
  );
}
