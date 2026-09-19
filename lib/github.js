const repo = process.env.PATCH_PARTNERS_REPO || "iamcoolpersondev/patchpartners";

function headers() {
  if (!process.env.GITHUB_PAT) throw new Error("GITHUB_PAT is not configured");
  return {
    Authorization: `Bearer ${process.env.GITHUB_PAT}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

export async function createRequestIssue(data) {
  const body = [
    "## Customer request",
    "",
    `**Name:** ${data.name}`,
    `**Email:** ${data.email}`,
    `**Type:** ${data.type}`,
    `**Urgency:** ${data.urgency}`,
    `**Project link:** ${data.link || "Not provided"}`,
    "",
    "### Details",
    data.details,
    "",
    "---",
    `Submitted: ${new Date().toISOString()}`,
  ].join("\n");

  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ title: `[NEW] ${data.type} — ${data.name}`, body }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Could not store request");
  return json;
}

export async function listRequestIssues() {
  const res = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100&sort=created&direction=desc`, {
    headers: headers(),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Could not load requests");
  return json.filter((i) => !i.pull_request).map((i) => ({
    number: i.number,
    title: i.title,
    body: i.body || "",
    state: i.state,
    createdAt: i.created_at,
    updatedAt: i.updated_at,
    url: i.html_url,
  }));
}

export async function updateRequestStatus(number, status) {
  const prefix = status === "done" ? "[DONE]" : status === "progress" ? "[IN PROGRESS]" : "[NEW]";
  const get = await fetch(`https://api.github.com/repos/${repo}/issues/${number}`, { headers: headers(), cache: "no-store" });
  const issue = await get.json();
  if (!get.ok) throw new Error(issue.message || "Could not load request");
  const cleanTitle = issue.title.replace(/^\[(NEW|IN PROGRESS|DONE)\]\s*/i, "");
  const res = await fetch(`https://api.github.com/repos/${repo}/issues/${number}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      title: `${prefix} ${cleanTitle}`,
      state: status === "done" ? "closed" : "open",
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Could not update request");
  return json;
}
