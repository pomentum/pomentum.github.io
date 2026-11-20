// The preview a shared link to graphos's page shows (public/og.png): the page's first screen, 1200 × 630, dark. Run it after
// `npm run build`, with the site served locally (from the repository's root: python -m http.server 8000), whenever the first
// screen changes, then build again so the image is copied in. It drives a local Chrome or Edge through its DevTools protocol.
//   node scripts/og-image.mjs [http://localhost:8000/graphos/]
//   CHROME=/path/to/chrome node scripts/og-image.mjs     (when Chrome is elsewhere)
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const URL_ = process.argv[2] ?? "http://localhost:8000/graphos/";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og.png");
const CANDIDATES = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const CHROME = CANDIDATES.find((c) => existsSync(c));
if (!CHROME) throw new Error("og-image: no Chrome or Edge found; set CHROME");

const PORT = 9335;
const profile = mkdtempSync(join(tmpdir(), "og-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try {
      target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page");
    } catch {}
  }
  if (!target) throw new Error("og-image: Chrome did not start");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) pending.get(m.id)(m), pending.delete(m.id);
  });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

  await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `${URL_}?theme=dark#/` });
  // wait for the first screen to be drawn, and its fonts
  let drawn = false;
  for (let i = 0; i < 40 && !drawn; i++) {
    await sleep(250);
    const r = await send("Runtime.evaluate", { expression: "!!document.querySelector('.hero .lede') && document.fonts.status === 'loaded'", returnByValue: true });
    drawn = !!r.result?.result?.value;
  }
  if (!drawn) throw new Error(`og-image: the first screen did not appear at ${URL_}; is the site served there?`);
  await sleep(500);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(OUT, Buffer.from(shot.result.data, "base64"));
  console.log(`og-image: ${OUT}`);
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
