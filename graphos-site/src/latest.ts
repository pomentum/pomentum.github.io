import { useEffect, useState } from "react";
import { VERSION } from "../content/version";

// graphos's latest release, read from GitHub in the browser, so a new release shows on the page without rebuilding it. The
// answer is kept for six hours (GitHub allows 60 unauthenticated requests an hour per address); with no answer, or one that is
// not a version, the page shows the release it was built with. Only "Latest" and the version line follow it: the statuses keep
// the release the use cases were checked against (content/version.ts).

const API = "https://api.github.com/repos/pomentum/graphos/releases/latest";
const KEY = "graphos-latest-release";
const TTL = 6 * 60 * 60 * 1000;
const SHAPE = /^v?(\d+\.\d+\.\d+(?:[-+][\w.-]+)?)$/;

function cached(): { v: string; at: number } | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return c && typeof c.v === "string" && SHAPE.test(c.v) && typeof c.at === "number" ? c : null;
  } catch {
    return null;
  }
}

let pending: Promise<string | null> | null = null;
function fetchLatest(): Promise<string | null> {
  pending ??= fetch(API, { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      const m = typeof j?.tag_name === "string" ? SHAPE.exec(j.tag_name) : null;
      if (!m) return null;
      try {
        localStorage.setItem(KEY, JSON.stringify({ v: m[1], at: Date.now() }));
      } catch {
        /* storage blocked: the answer lasts for this visit */
      }
      return m[1];
    })
    .catch(() => null);
  return pending;
}

export function useLatestVersion(): string {
  const [v, setV] = useState(() => cached()?.v ?? VERSION);
  useEffect(() => {
    const c = cached();
    if (c && Date.now() - c.at < TTL) return;
    let live = true;
    fetchLatest().then((latest) => {
      if (live && latest) setV(latest);
    });
    return () => {
      live = false;
    };
  }, []);
  return v;
}
