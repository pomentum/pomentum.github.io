// One sitemap.xml and one llms.txt at the site's root, from the ones each project's page writes (syrmos-site and graphos-site
// each write their own, in their built folder). The pages workflow runs it on the assembled site; it is never published.
//   node tools/site-index.mjs _site
// sitemap.xml: every address of both, once, in order. llms.txt: Syrmos's, which speaks for Pomentum as a whole, with graphos's
// use cases and pages added before its closing "## Pomentum" list.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const site = process.argv[2];
if (!site) throw new Error("usage: node tools/site-index.mjs <assembled site>");
const PROJECTS = ["syrmos", "graphos"];
const read = (p) => readFileSync(join(site, p, "sitemap.xml"), "utf8");

const seen = new Set();
const urls = PROJECTS.flatMap((p) => [...read(p).matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0])).filter((u) => {
  const loc = /<loc>([^<]+)<\/loc>/.exec(u)?.[1];
  if (!loc || seen.has(loc)) return false;
  seen.add(loc);
  return true;
});
writeFileSync(join(site, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  ${u}`).join("\n")}\n</urlset>\n`);

const syrmos = readFileSync(join(site, "syrmos", "llms.txt"), "utf8");
const graphos = readFileSync(join(site, "graphos", "llms.txt"), "utf8");
// graphos's own, without its title and summary: the root file has Pomentum's
const body = graphos.replace(/^# [^\n]*\n+(> [^\n]*\n)+\n*/, "").trim();
const at = syrmos.indexOf("\n## Pomentum");
if (at < 0 || !body.startsWith("graphos")) throw new Error("site-index: llms.txt is not in the shape expected");
writeFileSync(join(site, "llms.txt"), `${syrmos.slice(0, at).trimEnd()}\n\n${body}\n${syrmos.slice(at)}`);

for (const p of PROJECTS) for (const f of ["sitemap.xml", "llms.txt"]) rmSync(join(site, p, f));
console.log(`site-index: ${urls.length} addresses in sitemap.xml; llms.txt for ${PROJECTS.join(" and ")}`);
